import { parseInvoiceText } from '../lib/agent/audit.ts';
import type { Invoice, VendorContract } from '../lib/agent/types';

export interface SampleInvoice { id: string; label: string; description: string; rawText: string; invoice: Invoice; contract: VendorContract }
function preset(id: string, label: string, description: string, lines: string[], total: number, rates: Record<string, number>, discount = false): SampleInvoice {
  const rawText = `INVOICE #INV-${id.toUpperCase()}-2026\nVendor: ${label}\nIssue Date: 2026-10-22\nDue Date: 2026-11-21\nCurrency: USD\nBill To: AutoMesh Technologies\nItems:\n${lines.join('\n')}\nSubtotal: $${total.toFixed(2)}\nTax: $0.00\nTotal: $${total.toFixed(2)}\nPayment Terms: Net-30${discount ? '; 3% discount if paid within 10 days' : ''}`;
  return { id, label, description, rawText, invoice: { ...parseInvoiceText(rawText), vendorId: id }, contract: { vendorId: id, vendorName: label, contractedRates: rates, paymentTerms: 'Net-30', ...(discount ? { discountTerms: { percent: 3, withinDays: 10 } } : {}) } };
}
export const sampleFigma = preset('figma', 'Figma', 'Clean SaaS license', ['Design professional seat: 1 x $35.00 = $35.00'], 35, { 'Design professional seat': 35 });
export const sampleCloudScale = preset('cloudscale', 'CloudScale', 'Cloud compute · 3% Net-10', ['Compute instance hours: 90 x $0.15 = $13.50'], 13.5, { 'Compute instance hours': .15 }, true);
export const sampleSreDrift = preset('sre', 'SRE Partners', 'Contractor rate drift', ['On-call support hours: 1.5 x $30.00 = $45.00', 'Monitoring report: 1 x $5.00 = $5.00'], 50, { 'On-call support hours': 0, 'Monitoring report': 5 });
export const samplePhantomFee = preset('phantom', 'Relay Operations', 'Unauthorized surcharge', ['Workspace service: 1 x $25.00 = $25.00', 'Legacy Processing Convenience Surcharge: 1 x $9.00 = $9.00'], 34, { 'Workspace service': 25, 'Legacy Processing Convenience Surcharge': 0 });
export const samplePixelCraft = preset('pixelcraft', 'PixelCraft', 'Agency development · milestones', ['Product engineering sprint: 40 x $60.00 = $2400.00'], 2400, { 'Product engineering sprint': 60 });
export const sampleInvoices = [sampleFigma, sampleCloudScale, sampleSreDrift, samplePhantomFee, samplePixelCraft];
