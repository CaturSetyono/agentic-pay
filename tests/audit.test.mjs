import test from "node:test";
import assert from "node:assert/strict";
import { parseInvoiceText, auditInvoice } from "../src/lib/agent/audit.ts";

test("Invoice Ingestion: parses structured text into valid Invoice object", () => {
  const rawText = `
    INVOICE #INV-2026-881
    Vendor: CloudScale Systems Inc.
    Date: 2026-10-20
    Due: 2026-11-20
    Items:
    - Dedicated Compute Cluster: 2 x $120.00 = $240.00
    - Edge CDN Bandwidth 5TB: 1 x $45.00 = $45.00
    Subtotal: $285.00
    Tax: $28.50
    Total: $313.50
  `;

  const invoice = parseInvoiceText(rawText);
  assert.equal(invoice.invoiceNumber, "INV-2026-881");
  assert.equal(invoice.vendorName, "CloudScale Systems Inc.");
  assert.equal(invoice.items.length, 2);
  assert.equal(invoice.subtotal, 285.00);
  assert.equal(invoice.taxAmount, 28.50);
  assert.equal(invoice.totalAmount, 313.50);
});

test("Audit Engine: passes pristine invoice with 0 risk score", () => {
  const invoice = {
    id: "inv-001",
    invoiceNumber: "INV-2026-001",
    vendorId: "v-github",
    vendorName: "GitHub Enterprise",
    issueDate: "2026-10-01",
    dueDate: "2026-10-31",
    currency: "USD",
    items: [
      { id: "i1", description: "Enterprise Seats", quantity: 5, unitPrice: 21.00, amount: 105.00 }
    ],
    subtotal: 105.00,
    taxAmount: 0.00,
    totalAmount: 105.00,
    status: "auditing"
  };

  const result = auditInvoice(invoice);
  assert.equal(result.passed, true);
  assert.equal(result.riskScore, 0);
  assert.equal(result.riskLevel, "clean");
  assert.equal(result.discrepancies.length, 0);
});

test("Audit Engine: detects line-item arithmetic mismatch", () => {
  const invoice = {
    id: "inv-002",
    invoiceNumber: "INV-2026-002",
    vendorId: "v-agency",
    vendorName: "PixelCraft Agency",
    issueDate: "2026-10-10",
    dueDate: "2026-11-10",
    currency: "USD",
    items: [
      // 3 x 50 should be 150, but stated as 200
      { id: "i1", description: "UI Design Hours", quantity: 3, unitPrice: 50.00, amount: 200.00 }
    ],
    subtotal: 200.00,
    taxAmount: 0.00,
    totalAmount: 200.00,
    status: "auditing"
  };

  const result = auditInvoice(invoice);
  assert.equal(result.passed, false);
  assert.ok(result.riskScore >= 20);
  const mathErr = result.discrepancies.find(d => d.type === "math_error");
  assert.ok(mathErr, "Expected math_error discrepancy");
  assert.equal(mathErr.actualValue, 200.00);
  assert.equal(mathErr.expectedValue, 150.00);
});

test("Audit Engine: flags contract rate drift exceeding agreed terms", () => {
  const contract = {
    vendorId: "v-devops",
    vendorName: "SRE OnCall Solutions",
    contractedRates: {
      "On-Call Support Hour": 90.00
    },
    paymentTerms: "Net-30"
  };

  const invoice = {
    id: "inv-003",
    invoiceNumber: "INV-2026-003",
    vendorId: "v-devops",
    vendorName: "SRE OnCall Solutions",
    issueDate: "2026-10-15",
    dueDate: "2026-11-15",
    currency: "USD",
    items: [
      // Contract agreed $90/hr, invoice billed $130/hr
      { id: "i1", description: "On-Call Support Hour", quantity: 5, unitPrice: 130.00, amount: 650.00 }
    ],
    subtotal: 650.00,
    taxAmount: 0.00,
    totalAmount: 650.00,
    status: "auditing"
  };

  const result = auditInvoice(invoice, contract);
  assert.equal(result.passed, false);
  const rateDrift = result.discrepancies.find(d => d.type === "rate_drift");
  assert.ok(rateDrift, "Expected rate_drift discrepancy");
  assert.equal(rateDrift.expectedValue, 90.00);
  assert.equal(rateDrift.actualValue, 130.00);
});

test("Audit Engine: detects unauthorized hidden phantom fees", () => {
  const invoice = {
    id: "inv-004",
    invoiceNumber: "INV-2026-004",
    vendorId: "v-saas",
    vendorName: "LogStream IO",
    issueDate: "2026-10-18",
    dueDate: "2026-11-18",
    currency: "USD",
    items: [
      { id: "i1", description: "Pro Plan Subscription", quantity: 1, unitPrice: 99.00, amount: 99.00 },
      { id: "i2", description: "Legacy Processing Convenience Surcharge", quantity: 1, unitPrice: 35.00, amount: 35.00 }
    ],
    subtotal: 134.00,
    taxAmount: 0.00,
    totalAmount: 134.00,
    status: "auditing"
  };

  const result = auditInvoice(invoice);
  const surcharge = result.discrepancies.find(d => d.type === "unauthorized_surcharge");
  assert.ok(surcharge, "Expected unauthorized_surcharge discrepancy for phantom fee");
  assert.ok(result.riskScore >= 30);
});
