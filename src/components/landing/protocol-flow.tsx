import React from "react";
import { ArrowRight, Check, Search, Shield, Wallet } from "lucide-react";

export function ProtocolFlow() {
  return (
    <section className="landing-section" id="how-it-works">
      <div className="section-header">
        <span className="eyebrow">DETERMINISTIC 3-STAGE PIPELINE</span>
        <h2 className="section-title">How the Autonomous Commerce Protocol Operates</h2>
        <p className="section-desc">
          AgenticPay replaces chaotic manual approvals with a transparent, three-phase autonomous
          pipeline engineered with zero LLM arithmetic hallucinations.
        </p>
      </div>

      <div className="protocol-stages">
        <div className="stage-card">
          <div className="stage-header">
            <span className="stage-num">01</span>
            <span className="stage-tag">Perception &amp; Audit</span>
          </div>
          <div className="stage-icon-wrap">
            <Search size={20} />
          </div>
          <h3 className="stage-title">Invoice Ingestion &amp; Discrepancy Radar</h3>
          <p className="stage-body">
            Parses raw invoice text or JSON into typed line items. Validates quantities, unit rates,
            subtotals, and taxes against master vendor contracts. Calculates an objective Risk Score (0 to 100)
            and flags rogue rate drift or unauthorized phantom fees.
          </p>
          <div className="stage-meta">
            <span>Inputs: Vendor Invoice + Contract Rate Card</span>
            <span>Outputs: Typed Invoice + Discrepancy Matrix + Risk Score</span>
          </div>
        </div>

        <div className="stage-card">
          <div className="stage-header">
            <span className="stage-num">02</span>
            <span className="stage-tag">Decision &amp; Terms</span>
          </div>
          <div className="stage-icon-wrap">
            <Shield size={20} />
          </div>
          <h3 className="stage-title">Policy Guardrails &amp; Counter-Offer</h3>
          <p className="stage-body">
            Evaluates the audited invoice against corporate policy limits ($500 autonomous threshold &amp;
            monthly department velocity caps). For clean invoices, the agent calculates an early-payment
            Net-10 counter-offer (e.g. 3% discount). For high-risk invoices, it triggers human-in-the-loop escalation.
          </p>
          <div className="stage-meta">
            <span>Inputs: Risk Score + Budget Ceilings</span>
            <span>Outputs: Policy Clearance + Net-10 Counter-Offer</span>
          </div>
        </div>

        <div className="stage-card">
          <div className="stage-header">
            <span className="stage-num">03</span>
            <span className="stage-tag">Settlement &amp; Proof</span>
          </div>
          <div className="stage-icon-wrap">
            <Wallet size={20} />
          </div>
          <h3 className="stage-title">PayPal Orders v2 &amp; SHA-256 Ledger</h3>
          <p className="stage-body">
            Generates a compliant PayPal Orders v2 CAPTURE payload using deterministic idempotency keys.
            Simulates authorized capture through PayPal’s sandbox API and records the transaction into
            an immutable audit ledger sealed with a cryptographic SHA-256 hash.
          </p>
          <div className="stage-meta">
            <span>Inputs: Approved Payload + Counter-Offer</span>
            <span>Outputs: PayPal Capture ID + SHA-256 Tamper-Proof Receipt</span>
          </div>
        </div>
      </div>

      <div className="interactive-guide-box">
        <div className="guide-header">
          <span className="guide-badge">HOW TO TEST IN THE SANDBOX BELOW</span>
          <h4>Four Quick Steps to Experience the Autonomous Flow:</h4>
        </div>
        <div className="guide-steps">
          <div className="guide-step">
            <span className="step-badge">Step 1</span>
            <p>Select a preset in <strong>Tab 01 (Invoice Radar)</strong> such as <em>Figma (Clean)</em> or <em>SRE Partners (Rate Drift)</em>.</p>
          </div>
          <div className="guide-step">
            <span className="step-badge">Step 2</span>
            <p>Click <strong>Run Autonomous Audit</strong> to verify line-item math and view the calculated Risk Dial.</p>
          </div>
          <div className="guide-step">
            <span className="step-badge">Step 3</span>
            <p>Switch to <strong>Tab 02 (Policy &amp; Terms)</strong> to inspect the policy clearance and adjust the Net-10 cash discount.</p>
          </div>
          <div className="guide-step">
            <span className="step-badge">Step 4</span>
            <p>Switch to <strong>Tab 03 (PayPal Settlement)</strong> to dispatch the simulated PayPal Orders v2 capture and view the SHA-256 cryptographic receipt.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
