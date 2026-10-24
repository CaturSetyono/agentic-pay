# DESIGN.md — VibeDev-Inspired Light Product System

This is the visual contract for AgenticPay. The landing page uses the supplied VibeDev ID reference; the operational workspace carries the same restrained monochrome language at a denser scale.

## Surface architecture

1. **Editorial landing:** generous whitespace, bold Geist typography, clear product story, asymmetric proof surfaces, and one direct route into the sandbox.
2. **Operational workspace:** compact but comfortable audit, policy, and settlement controls. No marketing ornaments inside the tool.
3. **Developer provenance:** authentic attribution for Catur Setyono and direct project links.

## Core tokens

- Canvas: `#ffffff`
- Surface: `#ffffff`
- Subtle surface: `#fafafa` / `#f5f5f5`
- Primary text: `#000000`
- Secondary text: `#666666`
- Border: `#e5e5e5`
- Primary action: `#111111`, hover `#333333`
- Secondary accent: `#888888`
- Font: Geist for UI and headings; Geist Mono for money, timestamps, IDs, payloads, and hashes.
- Base spacing: `24px`; section rhythm uses `48px`, `72px`, `80px`, and `96px`.
- Cards: `16px`; buttons: `12px`; compact controls: `8px`.
- Low elevation only: `0 1px 2px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.04)`.

## Typography

- Display: 48–64px, weight 700, tight tracking.
- H1: 36px, weight 700.
- H2: 30px, weight 700.
- H3: 18–20px, weight 600.
- Body: 16–18px on landing; 14px in the workspace.
- Small labels: 12–14px, weight 500.
- Financial values always use tabular numerals.

## Interaction rules

- Default theme is light. Dark mode remains available as an accessibility preference, using neutral charcoal rather than indigo.
- Every interactive control must have hover, focus-visible, selected, disabled, and loading states where applicable.
- Touch targets must be at least 44px on mobile.
- Keep existing IDs, ARIA tab semantics, and tested workflows intact.

## Anti-slop gates

- No gradients, glow blobs, glassmorphism, decorative badges, or fake metrics.
- No generic centered hero followed by three identical feature cards.
- No saturated purple as a general accent.
- No excessive tiny text or cramped cards.
- No icon used only as decoration; icons must communicate an action or system state.
- No invented claims. Product evidence must come from the implemented deterministic audit, policy engine, PayPal sandbox simulation, and SHA-256 ledger.
