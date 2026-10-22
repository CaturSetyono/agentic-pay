import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { sampleInvoices, sampleCloudScale, samplePixelCraft } from '../src/data/sample-invoices.ts';
import { auditInvoice, parseInvoiceText } from '../src/lib/agent/audit.ts';
import { evaluatePolicy } from '../src/lib/agent/policy.ts';
import { generateNegotiationProposal } from '../src/lib/agent/negotiate.ts';
import { createPayPalOrderPayload } from '../src/lib/paypal/payload.ts';
import { settleSandbox } from '../src/lib/paypal/sandbox.ts';

test('five presets parse consistently and route to expected policy decisions', () => {
  const decisions = ['autonomous_settle', 'autonomous_settle', 'human_escalation', 'blocked', 'human_escalation'];
  sampleInvoices.forEach((sample, index) => {
    const parsed = parseInvoiceText(sample.rawText);
    assert.equal(parsed.totalAmount, sample.invoice.totalAmount);
    const audit = auditInvoice(parsed, sample.contract);
    assert.equal(evaluatePolicy(parsed, audit, 0).decision, decisions[index]);
    assert.equal(audit.discrepancies.some(d => d.type === 'math_error'), false);
  });
});

test('custom policy limits affect ceiling and velocity while retaining risk blocks', () => {
  const invoice = samplePixelCraft.invoice;
  const audit = auditInvoice(invoice, samplePixelCraft.contract);
  assert.equal(evaluatePolicy(invoice, audit, 0, undefined, { autonomousCeiling: 3000, monthlyLimit: 5000 }).decision, 'autonomous_settle');
  assert.equal(evaluatePolicy(invoice, audit, 2800, undefined, { autonomousCeiling: 3000, monthlyLimit: 5000 }).decision, 'human_escalation');
  assert.equal(evaluatePolicy(invoice, { ...audit, riskLevel: 'rejected' }, 0, undefined, { autonomousCeiling: 3000, monthlyLimit: 5000 }).decision, 'blocked');
});

test('Net-10 savings round to cents and milestone amounts reconcile', () => {
  assert.equal(generateNegotiationProposal(sampleCloudScale.invoice, sampleCloudScale.contract).savingsAmount, .41);
  const proposal = generateNegotiationProposal(samplePixelCraft.invoice, samplePixelCraft.contract);
  assert.equal(proposal.milestones.length, 2);
  assert.equal(proposal.milestones.reduce((sum, m) => sum + m.amount, 0), proposal.proposedTotal);
});

test('browser sandbox captures negotiated amount with independently verifiable SHA-256 receipt', async () => {
  const invoice = sampleCloudScale.invoice;
  const request = createPayPalOrderPayload(invoice, .41);
  const receipt = await settleSandbox(invoice, request);
  assert.equal(receipt.amount, '13.09');
  assert.equal(receipt.status, 'COMPLETED');
  assert.equal(receipt.webhook.event_type, 'PAYMENT.CAPTURE.COMPLETED');
  assert.equal(receipt.webhook.resource.id, receipt.transactionId);
  assert.equal(receipt.response.purchase_units[0].payments.captures[0].amount.value, receipt.amount);
  const canonical = JSON.stringify({ orderId: receipt.orderId, transactionId: receipt.transactionId, invoiceId: invoice.id, amount: receipt.amount, timestamp: receipt.timestamp });
  assert.equal(receipt.hash, createHash('sha256').update(canonical).digest('hex'));
});
