import { createHash } from 'node:crypto';
import type { Invoice } from '../agent/types';

export { createPayPalOrderPayload } from './payload.ts';

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
