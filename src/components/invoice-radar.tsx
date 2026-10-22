import { sampleInvoices, type SampleInvoice } from "@/data/sample-invoices";
import type { AuditResult, Invoice } from "@/lib/agent/types";
export function InvoiceRadar({
  selected,
  rawText,
  invoice,
  audit,
  error,
  onSelect,
  onEdit,
  onAudit,
  onProceed,
}: {
  selected: string;
  rawText: string;
  invoice: Invoice | null;
  audit: AuditResult | null;
  error: string;
  onSelect: (sample: SampleInvoice) => void;
  onEdit: (text: string) => void;
  onAudit: () => void;
  onProceed: () => void;
}) {
  const labels = {
    clean: "Clean",
    low_risk: "Low Risk",
    suspicious: "Suspicious",
    rejected: "Rejected",
  };
  return (
    <div className="module-content">
      <div className="preset-grid">
        {sampleInvoices.map((sample) => (
          <button
            key={sample.id}
            className={`preset ${selected === sample.id ? "selected" : ""}`}
            aria-pressed={selected === sample.id}
            onClick={() => onSelect(sample)}
          >
            <strong>{sample.label}</strong>
            <small>{sample.description}</small>
            <span>${sample.invoice.totalAmount.toFixed(2)}</span>
          </button>
        ))}
      </div>
      <div className="module-columns">
        <div>
          <label htmlFor="invoice-text">Raw invoice text</label>
          <textarea
            id="invoice-text"
            value={rawText}
            onChange={(event) => onEdit(event.target.value)}
            spellCheck={false}
            rows={14}
          />
          <button
            className="primary-button"
            onClick={onAudit}
            disabled={!rawText.trim()}
          >
            Run Agentic Audit
          </button>
          {error && (
            <p role="alert" className="error-text">
              {error}
            </p>
          )}
        </div>
        <div className="surface">
          <span className="eyebrow">DISCREPANCY SCORER</span>
          <div
            className={`risk-dial ${audit?.passed ? "green" : audit ? "amber" : ""}`}
          >
            <strong>{audit?.riskScore ?? "—"}</strong>
            <span>{audit ? labels[audit.riskLevel] : "Awaiting audit"}</span>
          </div>
          <p className="muted-text">
            {audit?.summary ??
              "Compare invoice arithmetic, contracted rates, and unauthorized charges."}
          </p>
          {audit && (
            <>
              <h3>Audit reasoning</h3>
              <ol className="reasoning">
                <li>
                  Parsed {invoice?.items.length} line item
                  {invoice?.items.length === 1 ? "" : "s"} for{" "}
                  {invoice?.vendorName}.
                </li>
                <li>Compared arithmetic and vendor contract rates.</li>
                {audit.reasoning.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
      {invoice && audit && (
        <>
          <div className="table-scroll">
            <table>
              <caption>Invoice line items · {invoice.invoiceNumber}</caption>
              <thead>
                <tr>
                  {["Description", "Qty", "Unit Price", "Amount", "Status"].map(
                    (label) => (
                      <th key={label}>{label}</th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>
                      <span
                        className={`pill ${audit.discrepancies.some((d) => d.description.startsWith(item.description + ":")) ? "amber" : "green"}`}
                      >
                        {audit.discrepancies.some((d) =>
                          d.description.startsWith(item.description + ":"),
                        )
                          ? "Review"
                          : "Verified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="discrepancies">
            {audit.discrepancies.map((d, index) => (
              <article className="surface" key={index}>
                <span className="pill amber">{d.severity}</span>
                <h3>
                  {
                    {
                      math_error: "Math error",
                      rate_drift: "Rate drift",
                      unauthorized_surcharge: "Phantom surcharge",
                      duplicate_item: "Duplicate invoice",
                      tax_mismatch: "Tax mismatch",
                    }[d.type]
                  }
                </h3>
                <p>{d.description}</p>
              </article>
            ))}
          </div>
          <button className="primary-button" onClick={onProceed}>
            Proceed to Policy &amp; Negotiation →
          </button>
        </>
      )}
    </div>
  );
}
