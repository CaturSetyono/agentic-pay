export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string;
  notes?: string;
}

export interface VendorContract {
  vendorId: string;
  vendorName: string;
  contractedRates: Record<string, number>;
  paymentTerms: string;
  discountTerms?: { percent: number; withinDays: number };
  maxMonthlyAllowance?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId?: string;
  vendorName: string;
  issueDate?: string;
  dueDate?: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  rawText?: string;
  status: 'received' | 'auditing' | 'verified' | 'disputed' | 'settled';
}

export interface AuditDiscrepancy {
  type: 'math_error' | 'rate_drift' | 'unauthorized_surcharge' | 'duplicate_item' | 'tax_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expectedValue?: number | string;
  actualValue?: number | string;
  financialImpact?: number;
}

export interface AuditResult {
  invoiceId: string;
  riskScore: number;
  riskLevel: 'clean' | 'low_risk' | 'suspicious' | 'rejected';
  discrepancies: AuditDiscrepancy[];
  passed: boolean;
  reasoning: string[];
  summary: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'threshold' | 'category' | 'velocity_limit' | 'risk_block';
  action: 'auto_approve' | 'require_human_approval' | 'reject';
}

export interface PolicyEvaluation {
  invoiceId: string;
  decision: 'autonomous_settle' | 'human_escalation' | 'blocked';
  escalated: boolean;
  triggeredRules: string[];
  requiresApprovalFrom?: string;
  reasoning: string[];
}
