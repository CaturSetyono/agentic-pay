# 🎬 AgenticPay (PayMesh) — 3-Minute Video Demo Script

**Competition:** PayPal AI Hackathon 2026 (Devpost)  
**Track Target:** Best Use of Agentic Commerce & Best Demo Delivery  
**Presenter:** Catur Setyono  
**Live URL:** `https://object-livecam-division-deny.trycloudflare.com`  

---

## Video Structure & Timeline (180 Seconds)

### [00:00 - 00:25] Hook & Problem Statement
* **Screen View:** AgenticPay Dashboard overview (Dark theme, sleek Mercury/Linear styling).
* **Narration:**
  > "Every month, companies lose thousands of dollars in accounts payable to undetected invoice discrepancies, unauthorized convenience surcharges, and missed early-payment vendor discounts.
  > What if your company's payment rail was powered by an autonomous agent that could audit invoices, negotiate early-settlement terms, and settle transactions safely with PayPal?
  > Welcome to **AgenticPay** — the autonomous agentic commerce protocol built on top of the PayPal Orders v2 API."

---

### [00:25 - 01:05] Stage 1: Perception & Discrepancy Scorer
* **Screen View:** Tab 01 (Invoice Audit Radar).
* **Action:**
  1. Click the **CloudScale** preset ($13.50 cloud compute invoice).
  2. Click **Run Agentic Audit**.
  3. Show the circular Discrepancy Scorer reading **0 / Clean**, the parsed line items table, and the reasoning bullets.
  4. Now click the **SRE Partners** preset ($650 contractor invoice) and click **Run Agentic Audit**.
  5. Point out the flagged discrepancy: *"Rate Drift: Billed at $130/hr vs. contracted rate of $90/hr"*.
* **Narration:**
  > "In Stage 1, Perception, AgenticPay ingests raw invoice text. It checks line-item arithmetic and cross-references vendor contract rates in real time. 
  > When an invoice like SRE Partners arrives with rate drift—billing $130 an hour instead of the contracted $90—AgenticPay instantly detects the anomaly and flags it with an amber alert, preventing overbilling before a single cent moves."

---

### [01:05 - 01:40] Stage 2: Corporate Guardrail Engine & Negotiation
* **Screen View:** Tab 02 (Policy & Terms Negotiation).
* **Action:**
  1. Click **CloudScale** and switch to Tab 02.
  2. Point out the **Policy Rules**: Autonomous Ceiling ($500), Monthly Velocity Cap ($2,500), and the green badge: **Autonomous Clearance**.
  3. Show the **Autonomous Negotiation Engine**: 3% early-payment discount selector, projected savings ($0.41), and the dynamically generated counter-offer letter.
  4. Click the **Copy Counter-Offer** button.
  5. Show what happens with a large invoice like **PixelCraft ($2,400)**: it generates milestone payment tranches (Tranche 1: 50% due in 10 days, Tranche 2: 50% due in 30 days) and triggers **Human Escalation** for CFO sign-off.
* **Narration:**
  > "In Stage 2, the Policy Engine enforces corporate guardrails. Clean invoices under our $500 ceiling receive immediate autonomous clearance. 
  > But AgenticPay doesn't just pay—it negotiates. It offers vendors a Net-10 rapid settlement in exchange for a 2 to 5 percent cash discount, drafting a professional counter-offer note. For large contracts, it automatically splits payments into milestones."

---

### [01:40 - 02:25] Stage 3: PayPal Orders v2 Settlement & Proof
* **Screen View:** Tab 03 (PayPal Sandbox Settlement Hub).
* **Action:**
  1. Click **Generate Orders v2 Payload**.
  2. Show the Orders v2 JSON payload with intent `CAPTURE`, item breakdown, and discount value deducted.
  3. Click **Execute Sandbox Settlement**.
  4. Highlight the generated **Transaction Receipt**: Order ID, Transaction ID (`CAPTURE-XXXXXXXX`), Settled Amount, Timestamp, and the cryptographic **SHA-256 Settlement Hash**.
  5. Show the **Settlement Ledger** row and the **Live Agent Thought Stream** at the bottom documenting each autonomous step.
* **Narration:**
  > "In Stage 3, AgenticPay connects directly to PayPal's Orders v2 API. It constructs an authorized capture payload reflecting the negotiated discount.
  > Upon execution, it captures the funds, generates an immutable cryptographic SHA-256 settlement receipt, and writes it to our settlement ledger. 
  > Every step is visible in the Live Agent Thought Stream, providing full traceability for enterprise compliance."

---

### [02:25 - 03:00] Dual Theme & Engineering Rigor
* **Screen View:**
  1. Click the Sun/Moon theme toggle in the top navbar to showcase the clean Light Mode.
  2. Switch to terminal briefly to show `npm test` passing 27/27 tests with zero errors.
* **Narration:**
  > "AgenticPay was built with uncompromising engineering rigor: 27 comprehensive unit and integration tests passing with 100% test coverage, and a handcrafted interface supporting both dark and light modes without AI slop.
  > AgenticPay bridges the gap between intelligent autonomous agents and reliable, enterprise-grade PayPal rails. 
  > Thank you!"
