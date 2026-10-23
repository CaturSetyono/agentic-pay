"use client";

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface PipelineCompositionProps {
  activeStage?: number; // 0: Perception/Audit, 1: Policy/Negotiation, 2: PayPal/Settlement, -1: Auto loop
}

export function PipelineComposition({ activeStage = -1 }: PipelineCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 120 frames total @ 30fps = 4.0 seconds
  // Phase 1: 0 - 39 (Perception & Discrepancy Audit)
  // Phase 2: 40 - 79 (Corporate Guardrail & Net-10 Negotiation)
  // Phase 3: 80 - 119 (PayPal Orders v2 & SHA-256 Settlement)
  
  const currentPhase = activeStage >= 0 ? activeStage : Math.floor(frame / 40) % 3;
  const phaseFrame = activeStage >= 0 ? 20 : frame % 40;

  // Spring animation for stage transitions
  const stageEntrance = spring({
    frame: phaseFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const pulse = Math.sin(frame / 5) * 0.5 + 0.5;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #0a0f1d 0%, #0e1526 100%)",
        color: "#f8fafc",
        fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
        border: "1px solid rgba(226, 232, 240, 0.08)",
        borderRadius: "6px",
      }}
    >
      {/* Top Telemetry Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(226, 232, 240, 0.08)",
          paddingBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#15be53",
              boxShadow: "0 0 8px rgba(21, 190, 83, 0.6)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            Autonomous Execution Loop · Remotion Motion Engine
          </span>
        </div>

        {/* 3 Step Indicator */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[0, 1, 2].map((step) => {
            const isActive = currentPhase === step;
            return (
              <div
                key={step}
                style={{
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  background: isActive ? "rgba(83, 58, 253, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: isActive ? "1px solid rgba(83, 58, 253, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                  color: isActive ? "#818cf8" : "#64748b",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s ease",
                }}
              >
                0{step + 1} {step === 0 ? "AUDIT" : step === 1 ? "POLICY" : "SETTLE"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Interactive Motion Canvas */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          gap: "24px",
          transform: `translateY(${(1 - stageEntrance) * 8}px)`,
          opacity: interpolate(phaseFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {/* Left: Dynamic Visual Graphic */}
        <div
          style={{
            flex: "0 0 45%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {currentPhase === 0 && (
            <div style={{ width: "100%", textAlign: "center" }}>
              {/* Radar Scanner Graphic */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  margin: "0 auto 12px",
                  borderRadius: "50%",
                  border: "1px dashed rgba(83, 58, 253, 0.3)",
                  position: "relative",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "15px",
                    borderRadius: "50%",
                    border: "1px solid rgba(83, 58, 253, 0.2)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, #533afd, transparent)",
                    transform: `rotate(${(frame * 9) % 360}deg)`,
                  }}
                />
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    background: "rgba(14, 21, 38, 0.95)",
                    border: "1px solid #15be53",
                    color: "#34d399",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  RISK 0/100
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Arithmetic verified · Math parity 100%
              </div>
            </div>
          )}

          {currentPhase === 1 && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <div
                style={{
                  background: "rgba(14, 21, 38, 0.8)",
                  border: "1px solid rgba(226, 232, 240, 0.08)",
                  borderRadius: "6px",
                  padding: "16px 20px",
                  maxWidth: "240px",
                  margin: "auto",
                }}
              >
                <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase" }}>
                  Autonomous Spend Ceiling
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 600,
                    fontFamily: "monospace",
                    color: "#f8fafc",
                    margin: "6px 0",
                  }}
                >
                  $500.00
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    background: "rgba(21, 190, 83, 0.15)",
                    color: "#34d399",
                    fontWeight: 600,
                  }}
                >
                  ✓ Clearance Granted
                </div>
              </div>
            </div>
          )}

          {currentPhase === 2 && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <div
                style={{
                  background: "rgba(14, 21, 38, 0.8)",
                  border: "1px solid rgba(83, 58, 253, 0.4)",
                  borderRadius: "6px",
                  padding: "14px 18px",
                  maxWidth: "260px",
                  margin: "auto",
                  position: "relative",
                  boxShadow: `0 0 ${15 + pulse * 10}px rgba(83, 58, 253, 0.2)`,
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    fontFamily: "monospace",
                    color: "#818cf8",
                    marginBottom: "4px",
                  }}
                >
                  PAYPAL ORDERS v2 · CAPTURE
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    fontFamily: "monospace",
                    color: "#f8fafc",
                  }}
                >
                  $304.09 USD
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#64748d",
                    fontFamily: "monospace",
                    marginTop: "6px",
                  }}
                >
                  SHA-256: 7f8b9e...2a14c8 (Sealed)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Operational Story & Realtime Metrics */}
        <div style={{ flex: "0 0 52%", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.06em",
              color: "#818cf8",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {currentPhase === 0
              ? "01 / Ingestion & Semantic Audit"
              : currentPhase === 1
              ? "02 / Guardrails & Net-10 Negotiation"
              : "03 / PayPal Orders v2 Settlement"}
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            {currentPhase === 0 && "Parsing invoice line items & checking contract rate parity."}
            {currentPhase === 1 && "Evaluating company spend limits & proposing early payment discount."}
            {currentPhase === 2 && "Executing automated PayPal capture with cryptographic proof."}
          </div>

          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              margin: "2px 0 0",
              lineHeight: 1.5,
            }}
          >
            {currentPhase === 0 &&
              "Deterministic math verifier checks subtotal, tax rate calculations, and contract hourly ceilings in sub-second latency."}
            {currentPhase === 1 &&
              "Under $500 ceiling invoices clear autonomously. Proactively proposes Net-10 terms to save 2-5% cash on every cleared vendor bill."}
            {currentPhase === 2 &&
              "Minting idempotency keys, dispatching Orders v2 capture payload, and generating tamper-proof SHA-256 ledger proof."}
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <span
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#15be53",
                background: "rgba(21, 190, 83, 0.12)",
                padding: "2px 6px",
                borderRadius: "3px",
              }}
            >
              Latency: 14ms
            </span>
            <span
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#818cf8",
                background: "rgba(83, 58, 253, 0.12)",
                padding: "2px 6px",
                borderRadius: "3px",
              }}
            >
              Engine: Node.js TDD
            </span>
            <span
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#f59e0b",
                background: "rgba(245, 158, 11, 0.12)",
                padding: "2px 6px",
                borderRadius: "3px",
              }}
            >
              Status: Deterministic
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "3px",
          background: "rgba(226, 232, 240, 0.08)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((frame % 120) / 120) * 100}%`,
            background: "linear-gradient(90deg, #533afd, #15be53)",
            borderRadius: "2px",
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
