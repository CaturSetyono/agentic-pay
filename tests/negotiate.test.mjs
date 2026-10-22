import test from "node:test";
import assert from "node:assert/strict";
import { generateNegotiationProposal } from "../src/lib/agent/negotiate.ts";

test("Negotiation Engine: generates 3% early payment discount counter-offer", () => {
  const invoice = {
    id: "inv-neg-01",
    invoiceNumber: "INV-2026-881",
    vendorName: "CloudScale Systems Inc.",
    dueDate: "2026-11-20",
    currency: "USD",
    totalAmount: 313.50,
    subtotal: 285.00
  };

  const proposal = generateNegotiationProposal(invoice, undefined, 3);
  assert.equal(proposal.originalTotal, 313.50);
  assert.equal(proposal.discountPercentage, 3);
  // 3% of 313.50 is 9.405 -> 9.41 rounded
  assert.equal(proposal.savingsAmount, 9.41);
  assert.equal(proposal.proposedTotal, 304.09);
  assert.ok(proposal.termsOffered.includes("Net-10"));
  assert.ok(proposal.counterOfferText.includes("CloudScale Systems Inc."));
  assert.ok(proposal.counterOfferText.includes("$304.09"));
});

test("Negotiation Engine: creates milestone release schedule for large invoices", () => {
  const invoice = {
    id: "inv-neg-02",
    invoiceNumber: "INV-2026-990",
    vendorName: "Architect Labs LLC",
    dueDate: "2026-12-01",
    currency: "USD",
    totalAmount: 2400.00,
    subtotal: 2400.00
  };

  const proposal = generateNegotiationProposal(invoice, undefined, 2);
  assert.ok(proposal.milestones && proposal.milestones.length === 2, "Expected 2 milestone tranches for large invoice");
  const [m1, m2] = proposal.milestones;
  assert.equal(m1.percentage, 50);
  assert.equal(m2.percentage, 50);
  assert.equal(m1.amount + m2.amount, proposal.proposedTotal);
});
