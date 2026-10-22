# AgenticPay (PayMesh)
## The Autonomous Commerce & Settlement Agent for PayPal Developer Platform

Built for **PayPal AI Hackathon 2026** on Devpost (Target: *Best Use of Agentic Commerce*, *Best Use of PayPal + AI*, and *Grand Prize*).

---

## 1. Executive Summary & Value Proposition

Traditional business payments and invoice processing suffer from manual verification latency, undetected vendor invoice discrepancies, missed early-payment discounts, and disjointed payment gateways.

**AgenticPay** transforms corporate spend and freelancer commerce into an **autonomous agentic workflow**:
1. **Perception & Semantic Audit**: Extracts structured line items from invoices, cross-references with vendor contracts, and calculates risk scores (detecting inflated rates, duplicate billing, phantom fees).
2. **Policy Guardrails & Human-in-the-Loop**: Executes autonomous micro-settlements for verified invoices below designated budget thresholds (e.g. < $500), while routing high-risk or large invoices to human managers with 1-click approvals.
3. **Autonomous Negotiation**: Generates automated counter-proposals (e.g. 3% discount for Net-10 instant settlement) using dynamic discount schedules.
4. **PayPal Sandbox Settlement**: Integrates directly with PayPal Orders v2 and Invoicing APIs in the Sandbox environment, generating idempotent transaction manifests and cryptographically-verifiable settlement receipts.

---

## 2. Technical Stack & Architectural Principles

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (Mercury / Linear aesthetic, Dark & Light Mode native toggle, `#08090a` slate palette, zero AI-slop)
- **Engine Core**:
  - `src/lib/agent/audit.ts` — Semantic invoice parser & discrepancy risk scorer
  - `src/lib/agent/policy.ts` — Spend policy engine with autonomous ceiling & velocity controls
  - `src/lib/agent/negotiate.ts` — Terms optimization & milestone splitter
  - `src/lib/paypal/client.ts` — PayPal Developer Sandbox client (Orders v2 API, capture, webhook verification, idempotent order payloads)
  - `src/lib/agent/orchestrator.ts` — Finite State Machine for autonomous agent execution
- **Testing Standard**: Strict Test-Driven Development (TDD) using native Node.js test runner (`node:test`, `node:assert`). Every engine method verified via RED-GREEN-REFACTOR.

---

## 3. Five-Loop Engineering Execution Plan

### Loop 1: Scaffolding, Core Types, & Linear Dark/Light UI Shell
- Setup Next.js 16, TypeScript, Tailwind CSS, Lucide React, and testing harness.
- Create App Shell with topbar metrics (Autonomous Budget, Settled YTD, Active Agents, Sandbox Status), theme toggle (Dark/Light), and navigation.
- Implement pre-paint theme script to eliminate FOUC.

### Loop 2: TDD Phase 1 — Invoice Audit & Policy Guardrail Engines
- Write failing unit tests first (`tests/audit.test.mjs`, `tests/policy.test.mjs`).
- Implement `audit.ts`: invoice parsing, line-item subtotal verification, tax rate validation, risk factor computation (anomalous line items, vendor mismatch).
- Implement `policy.ts`: spending limits, velocity checks, department budget tracking, autonomous vs human-escalation triage.
- Run tests and enforce 100% GREEN pass.

### Loop 3: TDD Phase 2 — Smart Terms Negotiation & PayPal Sandbox Client
- Write failing unit tests first (`tests/negotiate.test.mjs`, `tests/paypal.test.mjs`).
- Implement `negotiate.ts`: early-settlement discount matrices, milestone split logic, counter-offer template generator.
- Implement `paypal/client.ts`: OAuth token caching, Orders v2 `createOrder` payload constructor, `captureOrder` simulator, idempotency token generator, and webhook event simulator.
- Run tests and enforce 100% GREEN pass.

### Loop 4: Autonomous Agent Workspace & Interactive Experience
- Build **Agent Live Feed & Stream**: Real-time step-by-step reasoning logs (Perception ➔ Policy Check ➔ Risk Audit ➔ Negotiation ➔ PayPal Execution).
- Build **Invoice Ingestion Simulator**: Interactive sample invoice selector (SaaS License, Cloud Infra, Freelance Dev, Suspicious Vendor) with live file drag-and-drop.
- Build **Policy Rule Center**: Visual policy configurator (autonomous threshold slider, restricted merchant categories, required approvers).
- Build **PayPal Sandbox Checkout & Receipt Modal**: Live preview of PayPal order details, sandbox transaction IDs, and JSON payload inspector.

### Loop 5: End-to-End TDD Integration, Polish, & Devpost Pitch Pack
- Write and execute end-to-end integration tests (`tests/agent-flow.test.mjs`).
- Implement keyboard shortcuts (`1`, `2`, `3`, `s`, `?`, `Esc`).
- Prepare complete Devpost submission pack: project overview, architecture diagram, video demo guide, and setup instructions.
- Push clean commits to GitHub repository `CaturSetyono/agentic-pay`.
