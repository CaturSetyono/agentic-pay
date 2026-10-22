import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePolicy, DEFAULT_POLICIES } from "../src/lib/agent/policy.ts";

test("Policy Engine: defaults include risk, velocity, and approval guardrails", () => {
  assert.equal(new Set(DEFAULT_POLICIES.map(rule => rule.id)).size, DEFAULT_POLICIES.length);
  for (const [ruleType, action] of [
    ["risk_block", "reject"],
    ["velocity_limit", "require_human_approval"],
    ["threshold", "require_human_approval"],
    ["threshold", "auto_approve"],
  ]) {
    assert.ok(DEFAULT_POLICIES.some(rule => rule.ruleType === ruleType && rule.action === action));
  }
});

test("Policy Engine: auto-approves clean invoice under autonomous threshold ($500)", () => {
  const invoice = {
    id: "inv-clean-1",
    invoiceNumber: "INV-101",
    vendorName: "Figma Team",
    totalAmount: 180.00,
    currency: "USD"
  };

  const auditResult = {
    invoiceId: "inv-clean-1",
    riskScore: 0,
    riskLevel: "clean",
    passed: true,
    discrepancies: []
  };

  const evaluation = evaluatePolicy(invoice, auditResult, 800.00);
  assert.equal(evaluation.decision, "autonomous_settle");
  assert.equal(evaluation.escalated, false);
  assert.ok(evaluation.reasoning.some(r => r.includes("autonomous ceiling")));
});

test("Policy Engine: escalates clean invoice exceeding threshold ($1,200 > $500) for human approval", () => {
  const invoice = {
    id: "inv-large-1",
    invoiceNumber: "INV-102",
    vendorName: "AWS Cloud Services",
    totalAmount: 1200.00,
    currency: "USD"
  };

  const auditResult = {
    invoiceId: "inv-large-1",
    riskScore: 5,
    riskLevel: "low_risk",
    passed: true,
    discrepancies: []
  };

  const evaluation = evaluatePolicy(invoice, auditResult, 800.00);
  assert.equal(evaluation.decision, "human_escalation");
  assert.equal(evaluation.escalated, true);
  assert.equal(evaluation.requiresApprovalFrom, "Finance Controller");
});

test("Policy Engine: blocks settlement for high-risk or fraudulent invoice", () => {
  const invoice = {
    id: "inv-fraud-1",
    invoiceNumber: "INV-103",
    vendorName: "Unknown Shell Co.",
    totalAmount: 450.00,
    currency: "USD"
  };

  const auditResult = {
    invoiceId: "inv-fraud-1",
    riskScore: 85,
    riskLevel: "rejected",
    passed: false,
    discrepancies: [
      { type: "unauthorized_surcharge", severity: "critical", description: "Suspicious offshore handling fee" }
    ]
  };

  const evaluation = evaluatePolicy(invoice, auditResult, 800.00);
  assert.equal(evaluation.decision, "blocked");
  assert.equal(evaluation.escalated, false);
  assert.ok(evaluation.reasoning.some(r => r.toLowerCase().includes("risk") || r.toLowerCase().includes("blocked")));
});

test("Policy Engine: enforces monthly department velocity limit ($2,500 cap)", () => {
  const invoice = {
    id: "inv-velocity-1",
    invoiceNumber: "INV-104",
    vendorName: "Vercel Inc.",
    totalAmount: 350.00,
    currency: "USD"
  };

  const auditResult = {
    invoiceId: "inv-velocity-1",
    riskScore: 0,
    riskLevel: "clean",
    passed: true,
    discrepancies: []
  };

  // current monthly spend is $2,300, adding $350 breaches $2,500 limit
  const evaluation = evaluatePolicy(invoice, auditResult, 2300.00);
  assert.equal(evaluation.decision, "human_escalation");
  assert.equal(evaluation.escalated, true);
  assert.ok(evaluation.reasoning.some(r => r.includes("velocity") || r.includes("monthly budget")));
});
