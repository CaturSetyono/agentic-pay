import type { Invoice } from '../agent/types';
import { createPayPalOrderPayload } from './payload.ts';
export type OrderPayload = ReturnType<typeof createPayPalOrderPayload>;
export interface Settlement { invoiceId: string; vendorName: string; orderId: string; transactionId: string; status: 'COMPLETED'; amount: string; timestamp: string; hash: string; request: OrderPayload; response: object; webhook: object }
export async function settleSandbox(invoice: Invoice, request: OrderPayload): Promise<Settlement> {
  const orderId = `ORDER-${crypto.randomUUID().toUpperCase()}`;
  const transactionId = `CAPTURE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const amount = request.purchase_units[0].amount.value;
  const resource = { id: transactionId, status: 'COMPLETED' as const, amount: { currency_code: invoice.currency, value: amount }, create_time: timestamp };
  const receipt = JSON.stringify({ orderId, transactionId, invoiceId: invoice.id, amount, timestamp });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(receipt));
  const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  return { invoiceId: invoice.id, vendorName: invoice.vendorName, orderId, transactionId, status: 'COMPLETED', amount, timestamp, hash, request, response: { id: orderId, status: 'COMPLETED', purchase_units: [{ payments: { captures: [resource] } }] }, webhook: { id: `WH-${crypto.randomUUID()}`, event_type: 'PAYMENT.CAPTURE.COMPLETED', create_time: timestamp, resource } };
}
