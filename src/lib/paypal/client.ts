import { createHash } from 'node:crypto';
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

export function generateIdempotencyKey(invoiceId: string, action: string): string {
  return createHash('sha256').update(invoiceId + ':' + action).digest('hex').slice(0, 32);
}

export function simulateSandboxCapture(orderId: string, invoice: Partial<Invoice>) {
  return {
    orderId,
    transactionId: 'CAPTURE-' + createHash('sha256').update(orderId + ':capture').digest('hex').slice(0, 16).toUpperCase(),
    status: 'COMPLETED',
    amount: { value: (invoice.totalAmount || 0).toFixed(2), currency_code: invoice.currency || 'USD' },
    settlementReceiptHash: createHash('sha256').update(orderId + ':' + invoice.invoiceNumber + ':' + (invoice.totalAmount || 0)).digest('hex'),
    createTime: new Date().toISOString(),
  };
}

// Sandbox structure validation only; this does not authenticate PayPal signatures.
export function verifyWebhookEvent(payload: unknown, signatureHeader?: string) {
  void signatureHeader;
  if (
    typeof payload !== 'object' || payload === null ||
    !('event_type' in payload) || typeof payload.event_type !== 'string' || !payload.event_type.trim() ||
    !('resource' in payload) || typeof payload.resource !== 'object' || payload.resource === null ||
    !('id' in payload.resource) || typeof payload.resource.id !== 'string' || !payload.resource.id.trim()
  ) {
    return { valid: false };
  }

  return { valid: true, eventType: payload.event_type, resourceId: payload.resource.id };
}
