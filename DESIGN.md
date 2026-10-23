# DESIGN.md — Stripe Design System Specification for AgenticPay

This document is the authoritative design contract for AgenticPay. All visual refactoring must strictly comply with these rules. No deviations, no generic AI-slop tropes.

---

## 1. Visual Theme & Atmosphere (Stripe Fintech Standard)
- **Aesthetic Tone:** Financial-grade technical precision, whisper-weight authority, crisp micro-details, dense data surrounded by generous chrome.
- **Surface Archetypes:**
  - Tab 01: **Compare & Audit** (Tabular arithmetic, discrepancy flags, line-item inspector)
  - Tab 02: **Configure & Negotiate** (Rule sliders, policy cards, counter-offer proposal)
  - Tab 03: **Operate & Inspect** (Orders v2 JSON inspector, sandbox capture action, cryptographic settlement ledger)

---

## 2. Color Palette & Roles

### Dark Theme (Default)
- **Page Background Canvas:** `#0a0f1d` (Deep branded indigo-black, not flat neutral gray)
- **Card & Surface Background:** `#0e1526` / `#131b2e`
- **Surface Elevated:** `#18223a`
- **Primary Text:** `#f8fafc` (Slate-50)
- **Secondary / Label Text:** `#94a3b8` (Slate-400)
- **Muted / Timestamp Text:** `#64748b` (Slate-500)
- **Border Default:** `rgba(226, 232, 240, 0.08)` (1px solid crisp hairline)
- **Border Active / Focused:** `rgba(83, 58, 253, 0.4)` (Stripe Purple subtle glow)

### Light Theme
- **Page Background Canvas:** `#ffffff` (Pure white)
- **Surface / Card Background:** `#ffffff` with subtle depth
- **Surface Subtle / Table Header:** `#f8fafc`
- **Primary Heading Text:** `#061b31` (Stripe Deep Navy, NOT pure #000000)
- **Secondary / Label Text:** `#273951` (Dark Slate)
- **Body Text:** `#64748d` (Slate)
- **Border Default:** `#e5edf5` (Stripe soft blue-gray border)
- **Border Active:** `#b9b9f9` (Soft purple border)

### Brand & Accents
- **Primary Interactive / CTA:** `#533afd` (Stripe Signature Violet-Purple, hover `#4434d4`)
- **Secondary Action / PayPal Blue:** `#0070ba` (hover `#005ea6`)
- **Success Green:** `#15be53` (Badge bg: `rgba(21, 190, 83, 0.15)`, text: `#108c3d` in light, `#34d399` in dark)
- **Warning / Alert Amber:** `#f59e0b` (Badge bg: `rgba(245, 158, 11, 0.15)`, text: `#d97706` in light, `#fbbf24` in dark)
- **Risk / Danger Rose:** `#ea2261` (Stripe Ruby, badge bg: `rgba(234, 34, 97, 0.15)`, text: `#be123c` in light, `#f43f5e` in dark)

---

## 3. Depth & Shadows
- **Stripe Chromatic Blue Shadow (Light Mode):**
  `box-shadow: rgba(50, 50, 93, 0.12) 0px 15px 35px -5px, rgba(0, 0, 0, 0.07) 0px 5px 15px -5px;`
- **Subtle Surface Lift (Dark Mode):**
  `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);`

---

## 4. Typography Rules
- **Display Headlines:** Font weight 300 to 400 (light & whisper-authoritative, NOT bold 700+). Letter-spacing: `-0.02em` to `-0.03em`.
- **UI & Button Labels:** Font weight 400 to 500, clean sans-serif (`Geist Sans`, `Inter`, or `system-ui`).
- **Financial Numbers & Code:** **Always tabular figures** (`font-variant-numeric: tabular-nums`, monospace font family for amounts like `$304.09`, timestamps, hashes, IDs).

---

## 5. Geometry & Border Radius (Conservative Stripe Scale)
- **Buttons, Badges, Inputs:** `4px` to `6px` radius (NO pill-shaped oversized buttons).
- **Cards & Containers:** `6px` radius (tight, engineered, modern).
- **Inner Sub-Cards:** `4px` radius.

---

## 6. Anti-Slop Hard Gates (STRICTLY FORBIDDEN)
1. ❌ NO generic purple-blue linear gradients on hero sections.
2. ❌ NO colored accent borders on the left side of cards (`border-l-4`).
3. ❌ NO centered hero with 3 identical feature cards.
4. ❌ NO random sparkles (✨), zap (⚡), or rocket (🚀) icon toppers unless functionally required.
5. ❌ NO unearned frosted glass blur (`backdrop-blur-xl`) applied carelessly.
6. ❌ NO low-contrast washed-out gray text failing WCAG AA (min 4.5:1 ratio).
