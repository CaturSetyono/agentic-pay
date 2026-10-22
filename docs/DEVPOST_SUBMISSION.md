# Devpost Submission — PayPal AI Hackathon 2026

## General Information
- **Project Title:** AgenticPay (PayMesh)
- **Tagline / Elevator Pitch:** Autonomous Agentic B2B Commerce Protocol — Auditing Invoices, Enforcing Guardrails, Negotiating Early Payment Terms, and Settling via PayPal Orders v2 with Cryptographic Proof.
- **Target Prize Tracks:**
  1. **Best Use of Agentic Commerce** ($5,000)
  2. **Best Use of PayPal + AI** ($5,000)
  3. **Best Demo Delivery** ($5,000)
  4. **Grand Prize** ($12,000)

---

## About the Project

### 💡 Inspiration
In modern enterprises, accounts payable (AP) is notoriously fractured: finance teams spend hundreds of hours manually comparing PDF invoices against supplier rate cards, chasing department heads for approvals on minor subscriptions, and missing out on early-payment vendor discounts. Simultaneously, rogue SaaS charges, phantom fees, and contractor billing drifts slip through undetected.

We asked ourselves: **What if an autonomous AI agent could act as a trusted corporate treasury officer?** An agent that ingests raw vendor invoices, audits the line-item arithmetic and contract terms, checks dynamic corporate spend guardrails, autonomously negotiates a 2-5% Net-10 cash-flow discount, and executes verified settlement directly via **PayPal Orders v2 API** with cryptographic proof.

That is **AgenticPay (PayMesh)**.

---

### ⚙️ What it Does
AgenticPay turns passive corporate payments into an active, intelligent agentic workflow across 3 sequential stages:

1. **Perception & Discrepancy Scorer (Invoice Radar):**
   - Ingests unstructured or structured invoice text.
   - Extracts vendors, line items, taxes, currency, and payment terms.
   - Cross-checks arithmetic calculations and vendor contract rate cards.
   - Computes a deterministic **Risk Score (0–100)** and flags anomalies (arithmetic mismatches, contractor rate drifts, unauthorized processing surcharges).

2. **Corporate Guardrail Engine & Counter-Proposals (Policy & Negotiation):**
   - Evaluates dynamic spend policies: Autonomous Spending Ceiling ($500), Monthly Department Velocity Cap ($2,500), and hard risk blocks.
   - **Autonomous Clearance:** Invoices under the ceiling with clean audits clear automatically.
   - **Human-in-the-Loop Escalation:** High-value invoices ($1,000+) or rate deviations automatically route to the Finance Controller with full context.
   - **Autonomous Terms Negotiation:** Formulates proactive Net-10 early settlement counter-offers (saving 2–5% in treasury cash) and multi-tranche milestone schedules.

3. **PayPal Orders v2 Settlement & Cryptographic Proof (Settlement Hub):**
   - Constructs compliant PayPal Orders v2 `intent: CAPTURE` payloads with full purchase-unit item breakdown and negotiated discount deductions.
   - Simulates sandbox settlement and webhook event ingestion (`PAYMENT.CAPTURE.COMPLETED`).
   - Generates an immutable, verifiable **SHA-256 Settlement Receipt Hash** linking the PayPal transaction ID, invoice reference, amount, and timestamp.
   - Maintains a real-time **Settlement Ledger** and **Live Agent Thought Stream** for complete operational auditability.

---

### 🛠️ How We Built It
- **Architecture & Frontend:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS.
- **Design System:** Bespoke dark/light theme inspired by Linear and Mercury Bank (`#08090a` slate dark tokens, clean light mode, zero AI-slop, tabular monospace figures).
- **Agent Intelligence & Logic:** Modular TypeScript agent pipeline (`audit.ts`, `policy.ts`, `negotiate.ts`).
- **Payment Infrastructure:** PayPal Orders v2 integration layer (`client.ts`, `payload.ts`, `sandbox.ts`).
- **Engineering Rigor:** Built with strict **Test-Driven Development (TDD)** using Node.js 22 native test runner (`--experimental-strip-types`). **27/27 unit & integration tests passing** covering every edge case.
- **Public Sandbox Access:** Cloudflare Quick Tunnel for immediate remote live testing.

---

### 🚀 Challenges We Ran Into
- **Designing True Agentic Negotiation:** Balancing aggressive vendor cash discounts with realistic commercial feasibility. We solved this by implementing dynamic Net-10 discount formulas that scale based on payment urgency and invoice magnitude.
- **High Financial Precision:** Preventing JavaScript floating-point rounding quirks on multi-line taxes and discounts. We enforced cent-level mathematical rounding (`Math.round(...) / 100`) across all ledger entries and Orders v2 breakdown payloads.
- **Dual-Mode Visual Craft:** Ensuring both dark and light modes meet strict contrast ratios and look indistinguishable from top-tier fintech products like Mercury and Linear.

---

### 🏆 Accomplishments We're Proud Of
- **100% Test Passing Rate:** 27 comprehensive tests validating everything from regex text parsing and contract rate drifts to idempotency keys and cryptographic SHA-256 settlement receipts.
- **True End-to-End Autonomous Pipeline:** An invoice can travel from raw text perception to PayPal capture in under 2 seconds.
- **Zero AI Slop:** A handcrafted, world-class interface featuring real-time dual clocks (UTC/WIB), reactive policy sliders, and an interactive payload inspector.

---

### 📖 What We Learned
- PayPal's Orders v2 `breakdown` schema is remarkably flexible when paired with agentic intelligence, allowing transparent discounts and item-level settlement tracking.
- Clear audit trails (like our Live Agent Thought Stream and SHA-256 receipt hashes) are crucial for building enterprise trust in autonomous commerce agents.

---

### 🔮 What's Next for AgenticPay
- Direct integration with PayPal Payouts API for multi-vendor batch disbursements.
- LLM tool-calling endpoints (MCP server) allowing Claude, GPT, or Hermes agents to call `agenticpay_settle_invoice` directly from chat or terminal.
- Multi-currency cross-border hedging using real-time FX rates.

---

## Verification & Repositories
- **GitHub Repository:** [https://github.com/CaturSetyono/agentic-pay](https://github.com/CaturSetyono/agentic-pay) (Branch `main`, clean commit history).
- **Public Live Demo:** [https://object-livecam-division-deny.trycloudflare.com](https://object-livecam-division-deny.trycloudflare.com)
- **Built by:** Catur Setyono (Indonesia)
