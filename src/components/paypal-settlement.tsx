import { useRef, useState, type KeyboardEvent } from "react";
import type { OrderPayload, Settlement } from "@/lib/paypal/sandbox";
export function PayPalSettlement({
  payload,
  receipt,
  ledger,
  eligible,
  busy,
  onGenerate,
  onExecute,
}: {
  payload: OrderPayload | null;
  receipt: Settlement | null;
  ledger: Settlement[];
  eligible: boolean;
  busy: boolean;
  onGenerate: () => void;
  onExecute: () => void;
}) {
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = [
    "Orders v2 Request Payload",
    "PayPal Capture Response Payload",
    "Simulated Webhook Event",
  ];
  function navigate(e: KeyboardEvent<HTMLButtonElement>) {
    const next =
      e.key === "ArrowRight"
        ? (tab + 1) % 3
        : e.key === "ArrowLeft"
          ? (tab + 2) % 3
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? 2
              : null;
    if (next !== null) {
      e.preventDefault();
      setTab(next);
      refs.current[next]?.focus();
    }
  }
  return (
    <div className="module-content">
      <div className="sandbox-status">
        <span className="pill green">PayPal Sandbox · Local simulation</span>
        <code>POST https://api-m.sandbox.paypal.com/v2/checkout/orders</code>
        <code>POST /v2/checkout/orders/&#123;order_id&#125;/capture</code>
        <p>
          No network requests or real payments. Milestones are proposed terms;
          the demo captures the full negotiated amount.
        </p>
      </div>
      <div className="action-row">
        <button
          className="secondary-button"
          onClick={onGenerate}
          disabled={!eligible || busy || !!receipt}
        >
          Generate Orders v2 Payload
        </button>
        <button
          className="primary-button"
          onClick={onExecute}
          disabled={!eligible || !payload || busy || !!receipt}
        >
          {busy ? "Executing…" : "Execute Sandbox Settlement"}
        </button>
      </div>
      {!eligible && !receipt && (
        <p className="muted-text">
          Complete the audit and policy review. Escalated invoices require
          approval in the Policy tab.
        </p>
      )}
      {receipt && (
        <section className="surface receipt">
          <span className="pill green">{receipt.status}</span>
          <h3>Simulated transaction receipt</h3>
          <dl>
            <dt>Order ID</dt>
            <dd>{receipt.orderId}</dd>
            <dt>Transaction ID</dt>
            <dd>{receipt.transactionId}</dd>
            <dt>Settled Amount</dt>
            <dd>${receipt.amount} USD</dd>
            <dt>Timestamp</dt>
            <dd>{receipt.timestamp}</dd>
            <dt>Cryptographic SHA-256 Settlement Hash</dt>
            <dd>
              <code>{receipt.hash}</code>
            </dd>
          </dl>
        </section>
      )}
      <div className="json-tabs" role="tablist" aria-label="JSON inspector">
        {labels.map((label, index) => (
          <button
            key={label}
            ref={(el) => {
              refs.current[index] = el;
            }}
            id={`json-tab-${index}`}
            role="tab"
            aria-selected={tab === index}
            aria-controls="json-panel"
            tabIndex={tab === index ? 0 : -1}
            onKeyDown={navigate}
            className={`secondary-button ${tab === index ? "selected" : ""}`}
            onClick={() => setTab(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <pre
        id="json-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`json-tab-${tab}`}
      >
        {JSON.stringify(
          [payload, receipt?.response, receipt?.webhook][tab] ?? {
            message:
              tab === 0
                ? "Generate a payload to inspect it."
                : "Execute settlement to generate this event.",
          },
          null,
          2,
        )}
      </pre>
      <div className="table-scroll">
        <table>
          <caption>
            Settlement Ledger · {ledger.length} transactions · session only
          </caption>
          <thead>
            <tr>
              <th>Vendor / Transaction</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt hash</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry) => (
              <tr key={entry.orderId}>
                <td>
                  {entry.vendorName}
                  <small className="block">{entry.transactionId}</small>
                </td>
                <td>${entry.amount}</td>
                <td>
                  <span className="pill green">{entry.status}</span>
                </td>
                <td>
                  <code
                    className="ledger-hash"
                    title={`Click to copy full SHA-256 hash: ${entry.hash}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigator.clipboard?.writeText(entry.hash)}
                  >
                    {entry.hash.slice(0, 10)}…{entry.hash.slice(-8)}
                  </code>
                </td>
              </tr>
            ))}
            {!ledger.length && (
              <tr>
                <td colSpan={4}>No settlements yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
