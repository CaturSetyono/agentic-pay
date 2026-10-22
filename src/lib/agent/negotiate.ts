import type { Invoice, VendorContract } from './types';

export interface NegotiationProposal {
  originalTotal: number;
  proposedTotal: number;
  discountPercentage: number;
  savingsAmount: number;
  termsOffered: string;
  daysEarly: number;
  rationale: string;
  counterOfferText: string;
  milestones?: {
    milestoneIndex: number;
    title: string;
    percentage: number;
    amount: number;
    dueDays: number;
  }[];
}

export function generateNegotiationProposal(
  invoice: Partial<Invoice>,
  contract?: VendorContract,
  preferredDiscountPercent: number = 3,
): NegotiationProposal {
  const originalTotal = invoice.totalAmount || 0;
  // Percentage multiplication directly yields cents, avoiding division-induced rounding drift.
  const savingsAmount = Math.round(originalTotal * preferredDiscountPercent) / 100;
  const proposedTotal = Math.round((originalTotal - savingsAmount) * 100) / 100;
  const currency = invoice.currency || 'USD';
  const settlement = currency === 'USD'
    ? `$${proposedTotal.toFixed(2)}`
    : `${currency} ${proposedTotal.toFixed(2)}`;

  const proposal: NegotiationProposal = {
    originalTotal,
    proposedTotal,
    discountPercentage: preferredDiscountPercent,
    savingsAmount,
    termsOffered: `Net-10 Immediate Settlement (${preferredDiscountPercent}% Early Payment Discount)`,
    daysEarly: 20,
    rationale: `Offer settlement 20 days early in exchange for a ${preferredDiscountPercent}% discount, improving vendor cash flow and reducing payment processing delays.${contract ? ` Current contracted payment terms: ${contract.paymentTerms}.` : ''}`,
    counterOfferText: `Dear ${invoice.vendorName || 'Vendor'}, we propose early settlement of ${settlement} for invoice ${invoice.invoiceNumber || invoice.id || 'under review'} within 10 days, in exchange for a ${preferredDiscountPercent}% early payment discount. Please confirm your acceptance of these proposed terms so we can arrange payment. Thank you for your partnership.`,
  };

  if (originalTotal >= 1000) {
    const totalCents = Math.round(proposedTotal * 100);
    const firstCents = Math.round(totalCents / 2);
    proposal.milestones = [
      { milestoneIndex: 1, title: 'Initial settlement', percentage: 50, amount: firstCents / 100, dueDays: 0 },
      { milestoneIndex: 2, title: 'Final settlement', percentage: 50, amount: (totalCents - firstCents) / 100, dueDays: 10 },
    ];
  }

  return proposal;
}
