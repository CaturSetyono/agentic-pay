import type { AuditDiscrepancy, AuditResult, Invoice, VendorContract } from './types';

const money = (value: number): number => Math.round(value * 100) / 100;
const normalize = (value: string): string => value.trim().replace(/\s+/g, ' ').toLowerCase();

export function parseInvoiceText(rawText: string): Invoice {
  const numberPattern = '-?\\d[\\d,]*(?:\\.\\d+)?';
  const amountPattern = `(?:[A-Z]{3}\\s*)?[$€£]?\\s*(${numberPattern})`;
  const toNumber = (value: string): number => Number(value.replace(/,/g, ''));
  const field = (label: string): string | undefined =>
    rawText.match(new RegExp(`^\\s*(?:${label}):\\s*([^\\r\\n]+)`, 'im'))?.[1].trim();
  const amount = (label: string): number => {
    const match = rawText.match(new RegExp(`^\\s*(?:${label}):\\s*${amountPattern}\\s*$`, 'im'));
    return match ? toNumber(match[1]) : 0;
  };
  const invoiceNumber = rawText.match(/\bINV-[A-Z0-9-]+\b/i)?.[0] ?? '';
  const itemPattern = new RegExp(`^\\s*(?:[-*•]\\s*)?(.+?):\\s*(${numberPattern})\\s*[x×]\\s*${amountPattern}\\s*=\\s*${amountPattern}\\s*$`, 'gim');
  const items = Array.from(rawText.matchAll(itemPattern), (match, index) => ({
    id: `${invoiceNumber || 'invoice'}-item-${index + 1}`,
    description: match[1].trim(),
    quantity: toNumber(match[2]),
    unitPrice: toNumber(match[3]),
    amount: toNumber(match[4]),
  }));
  return {
    id: invoiceNumber || 'unidentified-invoice',
    invoiceNumber,
    vendorName: field('Vendor') ?? 'Unknown Vendor',
    issueDate: field('Issue Date|Date'),
    dueDate: field('Due Date|Due'),
    currency: field('Currency') ?? (rawText.includes('€') ? 'EUR' : rawText.includes('£') ? 'GBP' : 'USD'),
    items,
    subtotal: amount('Subtotal'),
    taxAmount: amount('Tax(?: Amount)?'),
    totalAmount: amount('Total(?: Amount)?'),
    rawText,
    status: 'received',
  };
}

export function auditInvoice(
  invoice: Invoice,
  contract?: VendorContract,
  recentInvoices: Invoice[] = [],
): AuditResult {
  const discrepancies: AuditDiscrepancy[] = [];
  const rates = new Map(Object.entries(contract?.contractedRates ?? {}).map(([name, rate]) => [normalize(name), rate]));
  for (const item of invoice.items) {
    const expected = money(item.quantity * item.unitPrice);
    if (Math.abs(money(item.amount - expected)) > 0) {
      discrepancies.push({ type: 'math_error', severity: 'medium', description: `${item.description}: quantity × unit price should equal ${expected}, but the billed amount is ${item.amount}.`, expectedValue: expected, actualValue: item.amount, financialImpact: money(item.amount - expected) });
    }
    const rate = rates.get(normalize(item.description));
    if (rate !== undefined && item.unitPrice > rate) {
      discrepancies.push({ type: 'rate_drift', severity: 'high', description: `${item.description}: billed rate ${item.unitPrice} exceeds the contracted rate ${rate}.`, expectedValue: rate, actualValue: item.unitPrice, financialImpact: money((item.unitPrice - rate) * item.quantity) });
    }
    if (/\b(surcharge|convenience\s+fee|handling\s+fee|platform\s+fee|offshore)\b/i.test(item.description)) {
      discrepancies.push({ type: 'unauthorized_surcharge', severity: /\boffshore\b/i.test(item.description) ? 'critical' : 'high', description: `${item.description}: suspicious fee requires verification of authorization.`, expectedValue: 0, actualValue: item.amount, financialImpact: item.amount });
    }
  }
  const subtotal = money(invoice.items.reduce((sum, item) => sum + item.amount, 0));
  if (Math.abs(money(invoice.subtotal - subtotal)) > 0.05) {
    discrepancies.push({ type: 'math_error', severity: 'medium', description: `Subtotal ${invoice.subtotal} does not match the item sum ${subtotal}.`, expectedValue: subtotal, actualValue: invoice.subtotal, financialImpact: money(invoice.subtotal - subtotal) });
  }
  const total = money(invoice.subtotal + invoice.taxAmount);
  if (Math.abs(money(invoice.totalAmount - total)) > 0.05) {
    discrepancies.push({ type: 'math_error', severity: 'medium', description: `Total ${invoice.totalAmount} does not match subtotal plus tax ${total}.`, expectedValue: total, actualValue: invoice.totalAmount, financialImpact: money(invoice.totalAmount - total) });
  }
  if (invoice.invoiceNumber && recentInvoices.some(recent =>
    recent.invoiceNumber === invoice.invoiceNumber &&
    (invoice.vendorId && recent.vendorId ? invoice.vendorId === recent.vendorId : normalize(invoice.vendorName) === normalize(recent.vendorName)))) {
    discrepancies.push({ type: 'duplicate_item', severity: 'critical', description: `Invoice ${invoice.invoiceNumber} already appears in recent invoices for this vendor.`, financialImpact: invoice.totalAmount });
  }
  const weights: Record<AuditDiscrepancy['type'], number> = { math_error: 25, rate_drift: 30, unauthorized_surcharge: 35, duplicate_item: 0, tax_mismatch: 25 };
  const riskScore = discrepancies.reduce((score, discrepancy) => score + weights[discrepancy.type] + (discrepancy.severity === 'critical' ? 50 : 0), 0);
  const riskLevel = riskScore === 0 ? 'clean' : riskScore <= 20 ? 'low_risk' : riskScore <= 60 ? 'suspicious' : 'rejected';
  const passed = riskScore <= 20;
  return {
    invoiceId: invoice.id, riskScore, riskLevel, discrepancies, passed,
    reasoning: discrepancies.length ? discrepancies.map(discrepancy => discrepancy.description) : ['Invoice arithmetic is consistent and no suspicious fees or contracted rate violations were found.'],
    summary: `Invoice ${invoice.invoiceNumber}: ${riskLevel}, risk score ${riskScore}, ${discrepancies.length} discrepancies. ${passed ? 'Audit passed.' : 'Settlement requires review.'}`,
  };
}
