import test from "node:test";
import assert from "node:assert/strict";
import { parseInvoiceText, auditInvoice } from "../src/lib/agent/audit.ts";
import { evaluatePolicy } from "../src/lib/agent/policy.ts";
import { generateNegotiationProposal } from "../src/lib/agent/negotiate.ts";
import { createPayPalOrderPayload, simulateSandboxCapture, verifyWebhookEvent } from "../src/lib/paypal/client.ts";

test("End-to-End Autonomous Agentic Commerce Flow: Pristine Small Invoice (< $500)", () => {
  // 1. Perception: Ingestion from invoice text
  const rawText = `
    INVOICE #INV-AUTO-101
    Vendor: Figma Design Systems
    Date: 2026-10-22
    Due: 2026-11-22
    Items:
    - Organization Plan Seats: 3 x $45.00 = $135.00
    Subtotal: $135.00
    Tax: $0.00
    Total: $135.00
  `;
  const invoice = parseInvoiceText(rawText);
  assert.equal(invoice.invoiceNumber, "INV-AUTO-101");
  assert.equal(invoice.totalAmount, 135.00);

  // 2. Semantic Audit
  const audit = auditInvoice(invoice);
  assert.equal(audit.passed, true);
  assert.equal(audit.riskScore, 0);

  // 3. Corporate Policy Evaluation
  const policy = evaluatePolicy(invoice, audit, 500.00);
  assert.equal(policy.decision, "autonomous_settle");
  assert.equal(policy.escalated, false);

  // 4. Autonomous Negotiation: 3% early settlement
  const proposal = generateNegotiationProposal(invoice, undefined, 3);
  assert.equal(proposal.originalTotal, 135.00);
  assert.equal(proposal.savingsAmount, 4.05);
  assert.equal(proposal.proposedTotal, 130.95);

  // 5. PayPal Sandbox Orders v2 Creation
  const orderPayload = createPayPalOrderPayload(invoice, proposal.savingsAmount);
  assert.equal(orderPayload.intent, "CAPTURE");
  assert.equal(orderPayload.purchase_units[0].amount.value, "130.95");

  // 6. PayPal Sandbox Settlement Execution
  const capture = simulateSandboxCapture("ORDER-SANDBOX-101", {
    ...invoice,
    totalAmount: proposal.proposedTotal
  });
  assert.equal(capture.status, "COMPLETED");
  assert.ok(capture.transactionId.startsWith("CAPTURE-"));
  assert.equal(capture.amount.value, "130.95");
  assert.ok(capture.settlementReceiptHash.length === 64);

  // 7. Webhook Event Verification
  const webhookResult = verifyWebhookEvent({
    event_type: "PAYMENT.CAPTURE.COMPLETED",
    resource: { id: capture.transactionId }
  });
  assert.equal(webhookResult.valid, true);
  assert.equal(webhookResult.resourceId, capture.transactionId);
});

test("End-to-End Autonomous Flow: Discrepancy & Escalation Guardrail Flow", () => {
  // Invoiced rate mismatch with contract
  const contract = {
    vendorId: "v-sec",
    vendorName: "CyberGuard SecOps",
    contractedRates: { "Penetration Testing Day": 1200.00 },
    paymentTerms: "Net-30"
  };

  const invoice = {
    id: "inv-sec-01",
    invoiceNumber: "INV-SEC-889",
    vendorId: "v-sec",
    vendorName: "CyberGuard SecOps",
    currency: "USD",
    items: [
      { id: "s1", description: "Penetration Testing Day", quantity: 2, unitPrice: 1600.00, amount: 3200.00 }
    ],
    subtotal: 3200.00,
    taxAmount: 0.00,
    totalAmount: 3200.00,
    status: "auditing"
  };

  const audit = auditInvoice(invoice, contract);
  assert.equal(audit.passed, false);
  assert.ok(audit.discrepancies.some(d => d.type === "rate_drift"));

  const policy = evaluatePolicy(invoice, audit, 1000.00);
  // Escalated due to amount > $500 and rate drift
  assert.equal(policy.decision, "human_escalation");
  assert.equal(policy.escalated, true);
  assert.equal(policy.requiresApprovalFrom, "Finance Controller");
});
