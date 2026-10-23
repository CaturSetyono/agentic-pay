import React from "react";
import { ArrowDown, ExternalLink } from "lucide-react";

interface LandingHeroProps {
  onLaunchWorkspace: () => void;
}

export function LandingHero({ onLaunchWorkspace }: LandingHeroProps) {
  return (
    <section className="landing-hero" id="overview">
      <div className="hero-eyebrow">
        <span className="hero-badge">PAYPAL AI HACKATHON 2026</span>
        <span className="hero-track">Autonomous Commerce & Agent Protocol</span>
      </div>

      <h1 className="hero-title">
        The Autonomous Payment Mesh for Agent-to-Agent Commerce
      </h1>

      <p className="hero-subtitle">
        AI agents are autonomously ordering infrastructure, APIs, and contractor hours—but
        corporate billing remains stalled in manual 30-day invoice queues.{" "}
        <strong>AgenticPay</strong> sits between autonomous agents and payment rails:
        mathematically auditing invoice line items in &lt;15ms, enforcing hard spend guardrails,
        auto-negotiating Net-10 cash discounts, and settling via PayPal Orders v2 with immutable
        SHA-256 cryptographic receipts.
      </p>

      <div className="hero-actions">
        <button
          type="button"
          className="primary-button hero-cta"
          onClick={onLaunchWorkspace}
        >
          <span>Open Interactive Sandbox</span>
          <ArrowDown size={14} />
        </button>
        <a
          href="https://github.com/CaturSetyono/agentic-pay"
          target="_blank"
          rel="noopener noreferrer"
          className="secondary-button hero-secondary"
        >
          <span>GitHub Repository</span>
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="hero-telemetry" aria-label="System verification metrics">
        <div className="telemetry-item">
          <span className="telemetry-value numeric">&lt; 15ms</span>
          <span className="telemetry-label">Audit Engine Latency</span>
          <span className="telemetry-sub">Deterministic Node.js math; 0 arithmetic hallucinations</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-value numeric">3.00%</span>
          <span className="telemetry-label">Net-10 Cash Savings</span>
          <span className="telemetry-sub">Automated liquidity counter-offers capturing capital discounts</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-value numeric">PayPal Orders v2</span>
          <span className="telemetry-label">Direct Settlement API</span>
          <span className="telemetry-sub">Idempotent order creation and capture protocol</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-value numeric">SHA-256 Ledger</span>
          <span className="telemetry-label">Cryptographic Proof</span>
          <span className="telemetry-sub">Tamper-proof verifiable settlement hashes on every transaction</span>
        </div>
      </div>
    </section>
  );
}
