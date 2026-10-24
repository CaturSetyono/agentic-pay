import React from "react";
import { ArrowDown, ExternalLink } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

const HERO_IMAGES = [
  { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80", alt: "Payment terminal on a retail counter" },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", alt: "Financial analytics dashboard" },
  { src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80", alt: "Secure digital payment card" },
  { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80", alt: "Team reviewing financial documents" },
  { src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80", alt: "Invoice and accounting documents" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", alt: "Electronic circuit architecture" },
];

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

      <div className="hero-layout">
        <div className="hero-copy">
          <h1 className="hero-title">
            Audit, negotiate, and settle autonomous purchases.
          </h1>

          <p className="hero-subtitle">
            <strong>AgenticPay</strong> is a policy layer between AI agents and payment rails.
            It verifies invoice math, enforces spend limits, negotiates Net-10 terms, and produces
            a traceable PayPal sandbox receipt—before money moves.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button hero-cta"
              onClick={onLaunchWorkspace}
            >
              <span>Try the live sandbox</span>
              <ArrowDown size={14} />
            </button>
            <a
              href="https://github.com/CaturSetyono/agentic-pay"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button hero-secondary"
            >
              <span>View source</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <TiltedGridHero
          images={HERO_IMAGES}
          speed={4.5}
          tileHeight={30}
          axis={57}
          curve={76}
          fade={10}
          className="hero-reel"
          aria-label="Autonomous commerce image reel"
        >
          <div className="hero-reel-visible" aria-hidden="true">
            {HERO_IMAGES.slice(0, 3).map((image, index) => (
              <img key={image.src} src={image.src} alt="" className={`hero-reel-preview preview-${index + 1}`} />
            ))}
          </div>
          <div className="hero-reel-overlay">
            <div className="proof-head">
              <span>LIVE DECISION TRACE</span>
              <span className="proof-status"><i /> CLEARED</span>
            </div>
            <div className="hero-reel-caption">
              <span className="numeric">INV-2026-041</span>
              <strong>Invoice verified. Policy cleared. Settlement ready.</strong>
              <span>Figma, Inc. · $304.09 USD · 12ms audit</span>
            </div>
          </div>
        </TiltedGridHero>
      </div>

      <div className="hero-telemetry" aria-label="System verification metrics">
        <div className="telemetry-item"><span className="telemetry-value numeric">&lt;15ms</span><span className="telemetry-label">Deterministic audit</span></div>
        <div className="telemetry-item"><span className="telemetry-value numeric">$500</span><span className="telemetry-label">Default ceiling</span></div>
        <div className="telemetry-item"><span className="telemetry-value numeric">3%</span><span className="telemetry-label">Net-10 proposal</span></div>
        <div className="telemetry-item"><span className="telemetry-value numeric">SHA-256</span><span className="telemetry-label">Receipt proof</span></div>
      </div>
    </section>
  );
}
