import test from "node:test";
import assert from "node:assert/strict";
import {
  createPayPalOrderPayload,
  generateIdempotencyKey,
  simulateSandboxCapture,
  verifyWebhookEvent
} from "../src/lib/paypal/client.ts";

test("PayPal Client: creates compliant Orders v2 payload", () => {
  const invoice = {
    id: "inv-pp-01",
    invoiceNumber: "INV-2026-881",
    vendorName: "CloudScale Systems Inc.",
    currency: "USD",
    subtotal: 285.00,
    taxAmount: 28.50,
    totalAmount: 313.50,
    items: [
      { id: "i1", description: "Dedicated Compute Cluster", quantity: 2, unitPrice: 120.00, amount: 240.00 },
      { id: "i2", description: "Edge CDN Bandwidth 5TB", quantity: 1, unitPrice: 45.00, amount: 45.00 }
    ]
  };

  const payload = createPayPalOrderPayload(invoice, 9.41);
  assert.equal(payload.intent, "CAPTURE");
  assert.equal(payload.purchase_units.length, 1);

  const unit = payload.purchase_units[0];
  assert.equal(unit.reference_id, "inv-pp-01");
  assert.equal(unit.invoice_id, "INV-2026-881");
  // 313.50 - 9.41 = 304.09
  assert.equal(unit.amount.value, "304.09");
  assert.equal(unit.amount.currency_code, "USD");
  assert.equal(unit.amount.breakdown.item_total.value, "285.00");
  assert.equal(unit.amount.breakdown.discount.value, "9.41");
  assert.equal(unit.amount.breakdown.tax_total.value, "28.50");
  assert.equal(unit.items.length, 2);
});

test("PayPal Client: generates deterministic idempotency keys", () => {
  const key1 = generateIdempotencyKey("inv-pp-01", "create_order");
  const key2 = generateIdempotencyKey("inv-pp-01", "create_order");
  const key3 = generateIdempotencyKey("inv-pp-01", "capture");

  assert.equal(key1, key2, "Idempotency keys with same parameters must match");
  assert.notEqual(key1, key3, "Idempotency keys with different action must differ");
  assert.ok(key1.length >= 16);
});

test("PayPal Client: simulates sandbox capture with cryptographic settlement hash", () => {
  const invoice = {
    id: "inv-pp-01",
    invoiceNumber: "INV-2026-881",
    vendorName: "CloudScale Systems Inc.",
    currency: "USD",
    totalAmount: 304.09
  };

  const capture = simulateSandboxCapture("ORDER-SANDBOX-772910", invoice);
  assert.equal(capture.status, "COMPLETED");
  assert.equal(capture.orderId, "ORDER-SANDBOX-772910");
  assert.ok(capture.transactionId.startsWith("CAPTURE-"));
  assert.equal(capture.amount.value, "304.09");
  assert.ok(capture.settlementReceiptHash.length === 64, "Expected SHA-256 settlement receipt hash");
  assert.ok(capture.createTime);
});

test("PayPal Client: verifies sandbox webhook events", () => {
  const event = {
    id: "WH-EVT-9002",
    event_type: "PAYMENT.CAPTURE.COMPLETED",
    create_time: new Date().toISOString(),
    resource: {
      id: "CAPTURE-98231201923",
      amount: { value: "304.09", currency_code: "USD" },
      status: "COMPLETED"
    }
  };

  const verification = verifyWebhookEvent(event);
  assert.equal(verification.valid, true);
  assert.equal(verification.eventType, "PAYMENT.CAPTURE.COMPLETED");
  assert.equal(verification.resourceId, "CAPTURE-98231201923");
});
