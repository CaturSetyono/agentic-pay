import type { Invoice } from '../agent/types';

export function createPayPalOrderPayload(invoice: Partial<Invoice>, discountAmount: number = 0) {
  const currency = invoice.currency || 'USD';

  return {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: invoice.id || 'ref-001',
      invoice_id: invoice.invoiceNumber,
      description: 'Settlement for ' + (invoice.vendorName || 'Vendor'),
      amount: {
        currency_code: currency,
        value: Math.max(0, (invoice.totalAmount || 0) - discountAmount).toFixed(2),
        breakdown: {
          item_total: { currency_code: currency, value: (invoice.subtotal || 0).toFixed(2) },
          discount: { currency_code: currency, value: discountAmount.toFixed(2) },
          tax_total: { currency_code: currency, value: (invoice.taxAmount || 0).toFixed(2) },
        },
      },
      items: (invoice.items || []).map(item => ({
        name: item.description,
        unit_amount: { currency_code: currency, value: item.unitPrice.toFixed(2) },
        quantity: String(item.quantity),
      })),
    }],
    application_context: {
      brand_name: 'AgenticPay',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'https://agenticpay.local/settlement/complete',
      cancel_url: 'https://agenticpay.local/settlement/cancel',
    },
  };
}

