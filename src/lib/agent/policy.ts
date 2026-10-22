import type { AuditResult, Invoice, PolicyEvaluation, PolicyRule } from './types';

export const DEFAULT_POLICIES: PolicyRule[] = [
  { id: 'risk-block', name: 'High-risk settlement block', description: 'Block rejected audits or risk scores above 65.', ruleType: 'risk_block', action: 'reject' },
  { id: 'monthly-velocity', name: 'Monthly spend limit', description: 'Require approval above $2,500 in monthly spend.', ruleType: 'velocity_limit', action: 'require_human_approval' },
  { id: 'approval-threshold', name: 'Autonomous ceiling', description: 'Require approval for invoices above $500.', ruleType: 'threshold', action: 'require_human_approval' },
  { id: 'autonomous-clearance', name: 'Autonomous clearance', description: 'Approve passing audits up to $500 within the monthly limit.', ruleType: 'threshold', action: 'auto_approve' },
  { id: 'audit-review', name: 'Audit review', description: 'Require review of unsuccessful audits.', ruleType: 'risk_block', action: 'require_human_approval' },
];

export function evaluatePolicy(
  invoice: Partial<Invoice>,
  auditResult: AuditResult,
  currentMonthlySpend: number,
  rules: PolicyRule[] = DEFAULT_POLICIES,
  limits = { autonomousCeiling: 500, monthlyLimit: 2500 },
): PolicyEvaluation {
  const total = invoice.totalAmount || 0;
  const blocked = auditResult.riskLevel === 'rejected' || auditResult.riskScore > 65;
  const velocityExceeded = currentMonthlySpend + total > limits.monthlyLimit;
  const ceilingExceeded = total > limits.autonomousCeiling;
  const triggeredRules: string[] = [];
  const reasoning: string[] = [];
  // Mandatory guardrails remain active even when callers supply custom rule metadata.
  const trigger = (ruleType: PolicyRule['ruleType'], action: PolicyRule['action'], fallbackId: string, reason: string) => {
    const matches = rules.filter(rule => rule.ruleType === ruleType && rule.action === action);
    triggeredRules.push(...(matches.length ? matches.map(rule => rule.id) : [fallbackId]));
    reasoning.push(reason);
  };
  if (blocked) {
    trigger('risk_block', 'reject', 'risk-block', `Settlement blocked: audit risk level ${auditResult.riskLevel}, risk score ${auditResult.riskScore}.`);
  } else {
    if (velocityExceeded) trigger('velocity_limit', 'require_human_approval', 'monthly-velocity', `Monthly velocity limit exceeded: projected spend ${currentMonthlySpend + total} exceeds the ${limits.monthlyLimit} monthly budget.`);
    if (ceilingExceeded) trigger('threshold', 'require_human_approval', 'approval-threshold', `Invoice amount ${total} exceeds the ${limits.autonomousCeiling} autonomous ceiling threshold.`);
    if (!auditResult.passed) trigger('risk_block', 'require_human_approval', 'audit-review', 'Audit did not pass; Finance Controller review is required.');
    if (!velocityExceeded && !ceilingExceeded && auditResult.passed) trigger('threshold', 'auto_approve', 'autonomous-clearance', `Autonomous clearance: audit passed, invoice is within the ${limits.autonomousCeiling} autonomous ceiling and the monthly velocity limit.`);
  }
  const escalated = !blocked && (velocityExceeded || ceilingExceeded || !auditResult.passed);
  return {
    invoiceId: invoice.id ?? auditResult.invoiceId,
    decision: blocked ? 'blocked' : escalated ? 'human_escalation' : 'autonomous_settle',
    escalated,
    triggeredRules: [...new Set(triggeredRules)],
    ...(escalated ? { requiresApprovalFrom: 'Finance Controller' } : {}),
    reasoning,
  };
}
