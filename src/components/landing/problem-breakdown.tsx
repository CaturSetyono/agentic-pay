import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ProblemBreakdown() {
  return (
    <section className="landing-section" id="problem">
      <div className="section-header">
        <span className="eyebrow">THE $300B FRICTION IN AUTONOMOUS SPEND</span>
        <h2 className="section-title">Why Legacy AP Rails Break When Software Buys Software</h2>
        <p className="section-desc">
          When autonomous AI agents procure cloud compute, specialized APIs, and outsourced technical
          labor, traditional enterprise accounts payable workflows introduce catastrophic delay and financial risk.
        </p>
      </div>

      <div className="split-comparison">
        <div className="comparison-card card-problem">
          <div className="card-badge badge-danger">
            <AlertTriangle size={14} />
            <span>Legacy Accounts Payable (Without AgenticPay)</span>
          </div>
          <h3 className="card-headline">Manual Batches &amp; Invisible Drift</h3>
          <ul className="comparison-list">
            <li>
              <strong>Silent Vendor Overbilling:</strong> Up to 14% of enterprise vendor invoices
              contain arithmetic errors, phantom surcharges, or subtle rate drift that human AP teams
              miss during end-of-month manual batch reviews.
            </li>
            <li>
              <strong>Unbounded Agent Liability:</strong> Granting an autonomous LLM or bot direct
              credit card credentials exposes companies to runaway token consumption, accidental cloud
              cluster provisioning, and infinite liability.
            </li>
            <li>
              <strong>Sluggish Net-30/60 Pay Cycles:</strong> Standard corporate billing delays payment
              by 30 to 60 days, tying up working capital and straining vendor relationships without
              earning any early payment discounts.
            </li>
            <li>
              <strong>Fragmented Audit Trails:</strong> Payment receipts are scattered across PDFs,
              emails, and disparate bank portals without cryptographic proof or deterministic verification.
            </li>
          </ul>
        </div>

        <div className="comparison-card card-solution">
          <div className="card-badge badge-success">
            <CheckCircle2 size={14} />
            <span>The AgenticPay Autonomous Protocol</span>
          </div>
          <h3 className="card-headline">Deterministic Verification &amp; Instant Settlement</h3>
          <ul className="comparison-list">
            <li>
              <strong>Sub-15ms Mathematical Audit:</strong> A deterministic Node.js engine verifies line-item
              arithmetic (<code>Qty × Rate = Subtotal</code>), tax calculations, and master contract hourly rates
              before a single dollar moves.
            </li>
            <li>
              <strong>Tiered Policy Guardrails:</strong> Autonomous settlement clearance is enforced up to a strict
              budget ceiling ($500), with automatic human escalation triggers for anomalies and monthly department velocity limits.
            </li>
            <li>
              <strong>Automated Liquidity Discounts:</strong> Instead of waiting 30 days, the agent automatically
              proposes Net-10 terms with a 2% to 5% cash discount, turning procurement into a working capital savings generator.
            </li>
            <li>
              <strong>Direct PayPal Orders v2 &amp; SHA-256 Ledger:</strong> Settlements execute directly via PayPal’s
              Orders v2 API with idempotent keys and are sealed into an immutable SHA-256 cryptographic audit ledger.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
