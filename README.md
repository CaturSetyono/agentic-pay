# AgenticPay (PayMesh)
> **The Autonomous Agentic Commerce & Policy-Guarded Settlement Protocol**  
> Developed for the **PayPal AI Hackathon 2026** by **Catur Setyono**.

---

## ⚡ Overview
AgenticPay bridges enterprise procurement, vendor invoice auditing, and instantaneous settlement with the **PayPal Developer Platform Sandbox**. It empowers organizations to deploy autonomous financial agents that:
1. **Audit vendor invoices** against contracts, identifying phantom surcharges and math discrepancies.
2. **Apply corporate spend guardrails** (autonomous clearance under budget ceilings vs human-in-the-loop escalation).
3. **Negotiate terms dynamically** (proposing 2-3% early settlement discounts).
4. **Execute settlements via PayPal Sandbox Orders v2 API** with verifiable receipt tokens.

---

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (Mercury / Linear aesthetic with Dark & Light Mode)
- **Icons**: Lucide React
- **Testing**: Native Node.js Test Runner (`node:test`, `node:assert`) with strict TDD
- **Target Category**: *Best Use of Agentic Commerce ($5,000)*, *Best Use of PayPal + AI ($5,000)*, *Grand Prize ($12,000)*

---

## 🚀 Quick Start
```bash
npm install
npm test
npm run dev
```

Built with ❤️ by [Catur Setyono](https://github.com/CaturSetyono).

## Foundation preview (Loop 1)

Requires Node.js 20.9 or newer. The shell includes three workspace tabs,
UTC/WIB clocks, and dark, light, and system appearance preferences. Dark is the
default; preferences are saved under `agenticpay-theme` in local storage and
applied before paint. Open Settings to choose the system preference.

The dashboard uses sample metrics. The sandbox badge and `Sandbox-AutoMesh`
client ID are placeholders, not a verified PayPal connection. Invoice ingestion,
policy evaluation, negotiations, and settlement APIs are planned for later loops.
The initial demo budget is $7,500.00 and settled volume is $3,820.00.

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

`npm test` checks configuration, design tokens, and pre-paint theme behavior,
including system preference and unavailable storage. Tailwind CSS v4 uses the
PostCSS plugin and CSS-defined theme tokens in `src/app/globals.css`.
