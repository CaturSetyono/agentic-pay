"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDownLeft, BadgeCheck, Check, ChevronRight, CircleDollarSign, Command, FileCheck2, Layers3, Moon, Radar, Settings2, ShieldCheck, Sun, Wallet, X } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { InvoiceRadar } from './invoice-radar';
import { NegotiationPolicy } from './negotiation-policy';
import { PayPalSettlement } from './paypal-settlement';
import { AgentStream, type AgentEvent } from './agent-stream';
import { PipelinePlayer } from './motion/pipeline-player';
import { LandingHero } from './landing/landing-hero';
import { ProblemBreakdown } from './landing/problem-breakdown';
import { ProtocolFlow } from './landing/protocol-flow';
import { DeveloperFooter } from './landing/developer-footer';
import { sampleFigma, type SampleInvoice } from '@/data/sample-invoices';
import { parseInvoiceText, auditInvoice } from '@/lib/agent/audit';
import { evaluatePolicy } from '@/lib/agent/policy';
import { generateNegotiationProposal } from '@/lib/agent/negotiate';
import type { Invoice, AuditResult } from '@/lib/agent/types';
import { createPayPalOrderPayload } from '@/lib/paypal/payload';
import { settleSandbox, type OrderPayload, type Settlement } from '@/lib/paypal/sandbox';

const views = [
  { title: "Invoice Audit Radar", subtitle: "Perception & Discrepancy Scorer", icon: Radar, label: "Perception", description: "A clearer view of every invoice.", detail: "Bring invoices into focus. Surface discrepancies, validate line items, and give every payment a confident starting point.", empty: "Your next invoice starts here", hint: "Invoice ingestion and discrepancy scoring arrive in the next loop.", steps: ["Extract line items", "Cross-check contracts", "Score discrepancies"], stage: "01" },
  { title: "Policy & Terms Negotiation", subtitle: "Guardrail Engine & Counter-Proposals", icon: ShieldCheck, label: "Decision", description: "Autonomy, within your boundaries.", detail: "Keep spend aligned with your rules and turn approved invoices into opportunities for better payment terms.", empty: "Set the terms for smarter commerce", hint: "Policy evaluation and counter-proposals are coming in subsequent loops.", steps: ["Evaluate spend limits", "Route for approval", "Propose better terms"], stage: "02" },
  { title: "PayPal Sandbox Settlement Hub", subtitle: "Orders v2 API & Receipt Verification", icon: CircleDollarSign, label: "Settlement", description: "Every payment. A verifiable outcome.", detail: "Move approved invoices through sandbox orders, capture confirmations, and traceable settlement receipts.", empty: "Ready for the final mile", hint: "PayPal Orders v2 and receipt verification will connect in a later loop.", steps: ["Create sandbox order", "Capture payment", "Verify the receipt"], stage: "03" },
];

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const format = (timeZone: string) => now?.toLocaleTimeString("en-GB", { timeZone, hour12: false }) ?? "--:--:--";
  return <div className="clock" aria-label="Current UTC and Western Indonesian time"><span>{format("UTC")} <b>UTC</b></span><span>{format("Asia/Jakarta")} <b>WIB</b></span></div>;
}

export function AppShell() {
  const [active, setActive] = useState(0);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const settings = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const view = views[active];
  const [sample, setSample] = useState<SampleInvoice>(sampleFigma);
  const [rawText, setRawText] = useState(sampleFigma.rawText);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [ceiling, setCeiling] = useState(500);
  const [monthlyLimit, setMonthlyLimit] = useState(2500);
  const [discount, setDiscount] = useState(3);
  const [payload, setPayload] = useState<OrderPayload | null>(null);
  const [ledger, setLedger] = useState<Settlement[]>([]);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [auditCount, setAuditCount] = useState(0);
  const spend = ledger.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const contract = invoice?.vendorName.toLowerCase() === sample.contract.vendorName.toLowerCase() ? sample.contract : undefined;
  const policy = invoice && audit ? evaluatePolicy(invoice, audit, spend, undefined, { autonomousCeiling: ceiling, monthlyLimit }) : null;
  const proposal = invoice ? generateNegotiationProposal(invoice, contract, discount) : null;
  const receipt = ledger.find(entry => entry.invoiceId === invoice?.id) ?? null;
  const eligible = policy?.decision === 'autonomous_settle' && !receipt;
  function log(stage: string, message: string) { setEvents(previous => [...previous, { id: previous.length + 1, time: new Date().toISOString(), stage, message }]); }
  function go(index: number) { setActive(index); tabRefs.current[index]?.focus(); }
  function edit(text: string) { if (lock.current) return; setRawText(text); setInvoice(null); setAudit(null); setPayload(null); setError(''); }
  function select(next: SampleInvoice) { if (lock.current) return; setSample(next); edit(next.rawText); }
  function runAudit() {
    if (lock.current) return;
    const parsed = parseInvoiceText(rawText);
    const required = ['Vendor', 'Subtotal', 'Tax(?: Amount)?', 'Total(?: Amount)?'];
    if (!parsed.invoiceNumber || !parsed.items.length || parsed.currency !== 'USD' || !Number.isFinite(parsed.totalAmount) || parsed.totalAmount <= 0 || parsed.items.some(item => !Number.isFinite(item.amount) || !Number.isFinite(item.quantity) || !Number.isFinite(item.unitPrice) || item.quantity <= 0 || item.unitPrice < 0) || required.some(label => !new RegExp(`^\\s*(?:${label}):`, 'im').test(rawText))) {
      setError('Enter a USD invoice with an INV- number, vendor, positive line items (Description: Qty x $Rate = $Amount), subtotal, tax, and total.'); return;
    }
    const matchedContract = parsed.vendorName.toLowerCase() === sample.contract.vendorName.toLowerCase() ? sample.contract : undefined;
    if (!matchedContract) { setError('Vendor must match the selected preset contract. Select the matching vendor before auditing.'); return; }
    parsed.vendorId = matchedContract.vendorId;
    const result = auditInvoice(parsed, matchedContract, ledger.filter(entry => entry.invoiceId === parsed.id).map(() => parsed));
    setInvoice(parsed); setAudit(result); setPayload(null); setError(''); setAuditCount(count => count + 1);
    log('Perception', `Parsed ${parsed.invoiceNumber}: ${parsed.items.length} items from ${parsed.vendorName}.`);
    log('Audit', result.summary);
  }
  function review() { if (!policy || !proposal) return; log('Policy', policy.reasoning.join(' ')); log('Negotiation', `${discount}% Net-10 proposal: $${proposal.savingsAmount.toFixed(2)} projected savings.`); go(1); }
  function limits(nextCeiling: number, nextMonthly: number) { if (lock.current || !Number.isFinite(nextCeiling) || !Number.isFinite(nextMonthly)) return; setCeiling(nextCeiling); setMonthlyLimit(nextMonthly); setPayload(null); log('Policy', `Limits updated: $${nextCeiling} autonomous ceiling / $${nextMonthly} monthly velocity.`); }
  function changeDiscount(percent: number) { if (lock.current) return; setDiscount(percent); setPayload(null); log('Negotiation', `Counter-offer revised to ${percent}% early-payment discount.`); }
  function generate() { if (!eligible || !invoice || !proposal) return; setPayload(createPayPalOrderPayload(invoice, proposal.savingsAmount)); log('PayPal', 'Generated simulated Orders v2 CAPTURE request.'); }
  async function execute(humanApproval = false) {
    if (lock.current || !invoice || !policy || !proposal || receipt || policy.decision === 'blocked' || (policy.escalated && !humanApproval)) return;
    lock.current = true; setBusy(true); setError('');
    try {
      if (humanApproval) log('Approval', `Human approved ${invoice.invoiceNumber} at $${proposal.proposedTotal.toFixed(2)} in sandbox.`);
      const request = payload ?? createPayPalOrderPayload(invoice, proposal.savingsAmount);
      setPayload(request); log('PayPal', 'Creating local sandbox order and capturing negotiated amount.');
      const entry = await settleSandbox(invoice, request);
      setLedger(previous => [...previous, entry]);
      log('Settlement', `${entry.transactionId} COMPLETED · $${entry.amount} · SHA-256 receipt recorded.`);
      go(2);
    } catch { setError('Sandbox settlement failed. Please retry; no transaction was recorded.'); log('Settlement', 'Capture failed; no settlement recorded.'); }
    finally { lock.current = false; setBusy(false); }
  }
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % views.length
      : event.key === "ArrowLeft" ? (index + views.length - 1) % views.length
      : event.key === "Home" ? 0 : event.key === "End" ? views.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); setActive(next); tabRefs.current[next]?.focus();
  }

  function scrollToWorkspace() {
    const el = document.getElementById("workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace">Skip to workspace</a>
      <header className="topbar">
        <a className="brand" href="/" aria-label="AgenticPay home">
          <span className="brand-icon"><Layers3 size={22} /></span>
          <span><strong>AgenticPay<span className="brand-dot">.</span></strong><small>Autonomous Commerce Mesh</small></span>
        </a>
        <nav className="topbar-nav" aria-label="Main Navigation">
          <a href="#overview">Overview</a>
          <a href="#problem">The Problem</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pipeline-visualizer">Motion Reel</a>
          <a href="#workspace">Live Sandbox</a>
          <a href="#developer">Developer</a>
        </nav>
        <div className="header-actions">
          <div className="desktop-clock"><Clock /></div>
          <div className="header-divider" />
          <button className="icon-button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`} title="Toggle theme">
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-button" onClick={() => settings.current?.showModal()} aria-label="Open settings" title="Settings">
            <Settings2 size={18} />
          </button>
          <a href="#workspace" className="primary-button header-demo-button">
            <span>Live Demo</span>
            <ChevronRight size={12} />
          </a>
        </div>
      </header>

      <main className="app-main">
        {/* Surface 1: High-Trust Developer Landing Page */}
        <LandingHero onLaunchWorkspace={scrollToWorkspace} />
        <ProblemBreakdown />
        <ProtocolFlow />

        {/* Surface 1.5: Programmatic Remotion Visualizer Reel */}
        <section className="landing-section" id="pipeline-visualizer">
          <div className="section-header">
            <span className="eyebrow">PROGRAMMATIC CODE-DRIVEN MOTION</span>
            <h2 className="section-title">Visualizing the Autonomous Lifecycle in Real-Time</h2>
            <p className="section-desc">
              Watch an invoice traverse the three stages: Perception &amp; Audit, Policy Clearance, and PayPal Sandbox Orders v2 Settlement—rendered at 30 FPS using the Remotion engine.
            </p>
          </div>
          <PipelinePlayer currentTab={active} />
        </section>

        {/* Surface 2: Live Operational Agent Workspace */}
        <section id="workspace" className="landing-section" style={{ borderBottom: "none", paddingTop: "40px" }}>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={12} /><span>Commerce overview</span></div>
          <section className="page-heading">
            <div>
              <div className="eyebrow"><span className="status-dot" /> LIVE INTERACTIVE WORKSPACE</div>
              <h1>Commerce, on autopilot.</h1>
              <p>Test real-world presets, audit discrepancies, and simulate instant PayPal Orders v2 captures.</p>
            </div>
            <div className="sandbox-badge shadow-stripe">
              <span className="paypal-mark">P</span>
              <span><strong><span className="status-dot" /> PayPal Sandbox Simulation</strong><small>Local simulation · No credentials</small></span>
            </div>
          </section>

          <section className="metrics" aria-label="Workspace metrics">
            <article className="metric">
              <div className="metric-label">Autonomous Budget Cap<Wallet size={16} /></div>
              <div className="metric-value">${monthlyLimit.toFixed(2)}<span>/ month</span></div>
              <div className="budget-track" role="progressbar" aria-label="Monthly budget used" aria-valuenow={monthlyLimit > 0 ? Math.min(100, Math.round(spend / monthlyLimit * 100)) : 0} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${monthlyLimit > 0 ? Math.min(100, spend / monthlyLimit * 100) : 0}%` }} />
              </div>
              <div className="metric-foot">
                <span>${spend.toFixed(2)} used</span>
                <span>${Math.max(0, monthlyLimit - spend).toFixed(2)} remaining</span>
              </div>
            </article>

            <article className="metric">
              <div className="metric-label">Invoices Audited<FileCheck2 size={16} /></div>
              <div className="metric-value">{auditCount}<span>processed</span></div>
              <div className="metric-note">
                <span className="pill green"><BadgeCheck size={12} />Live</span>
                <span>session audits</span>
              </div>
              <div className="metric-foot"><span>Precision at every step</span></div>
            </article>

            <article className="metric">
              <div className="metric-label">Settled via PayPal<ArrowDownLeft size={16} /></div>
              <div className="metric-value">${spend.toFixed(2)}</div>
              <div className="metric-note">
                <span className="pill indigo">USD</span>
                <span>sandbox settled</span>
              </div>
              <div className="metric-foot"><span>Sandbox environment only</span></div>
            </article>

            <article className="metric">
              <div className="metric-label">Policy Guardrails<ShieldCheck size={16} /></div>
              <div className="metric-value">3<span>active rules</span></div>
              <div className="metric-note"><span className="pill green"><Check size={12} />Enforced</span></div>
              <div className="metric-foot"><span>Within configured boundaries</span></div>
            </article>
          </section>

          <div className="section-heading">
            <h2>Interactive Agent Suite</h2>
            <span><span className="mini-dot" />Select a view below to interact with the agent pipeline</span>
          </div>

          <div className="view-tabs" role="tablist" aria-label="Commerce views">
            {views.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.stage}
                  ref={(element) => { tabRefs.current[index] = element; }}
                  id={`tab-${index}`}
                  role="tab"
                  aria-selected={active === index}
                  aria-controls={`panel-${index}`}
                  tabIndex={active === index ? 0 : -1}
                  className={cn("view-tab", active === index && "selected")}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => navigateTabs(event, index)}
                >
                  <span className="tab-icon"><Icon size={19} /></span>
                  <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                  <span className="tab-number">0{index + 1}</span>
                </button>
              );
            })}
          </div>

          <section className="workspace-panel" role="tabpanel" tabIndex={0} id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">{view.stage} / {view.label.toUpperCase()}</span>
                <h2>{view.description}</h2>
                <p>{view.detail}</p>
              </div>
              <span className="pill muted"><Command size={12} />Interactive</span>
            </div>
            {active === 0 && <InvoiceRadar selected={sample.id} rawText={rawText} invoice={invoice} audit={audit} error={error} onSelect={select} onEdit={edit} onAudit={runAudit} onProceed={review} />}
            {active === 1 && <NegotiationPolicy ceiling={ceiling} monthlyLimit={monthlyLimit} spend={spend} audit={audit} policy={policy} proposal={proposal} discount={discount} busy={busy} settled={!!receipt} onLimits={limits} onDiscount={changeDiscount} onApprove={() => void execute(true)} onProceed={() => go(2)} />}
            {active === 2 && <PayPalSettlement payload={receipt?.request ?? payload} receipt={receipt} ledger={ledger} eligible={!!eligible} busy={busy} onGenerate={generate} onExecute={() => void execute()} />}
            {active !== 0 && error && <p role="alert" className="error-text module-content">{error}</p>}
            <div className="panel-footer">
              <span><ShieldCheck size={14} />Human oversight. Agent execution.</span>
              <span className="pill amber">Loop 04 / 05</span>
            </div>
          </section>

          <AgentStream events={events} />
        </section>

        {/* Surface 3: Creator Profile & Contact Footer */}
        <DeveloperFooter />
      </main>

      <dialog ref={settings} className="settings-dialog" aria-labelledby="settings-title" onClick={(event) => { if (event.target === event.currentTarget) settings.current?.close(); }}>
        <div className="dialog-heading">
          <div><span className="eyebrow">WORKSPACE PREFERENCES</span><h2 id="settings-title">Settings</h2></div>
          <button className="icon-button" aria-label="Close settings" onClick={() => settings.current?.close()}><X size={20} /></button>
        </div>
        <label htmlFor="theme-select">Appearance</label>
        <p>Choose a theme or follow your device’s preference.</p>
        <select id="theme-select" value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">System</option>
        </select>
        <div className="settings-note">
          <ShieldCheck size={18} />
          <p>Interactive sandbox simulation. Metrics and receipts reflect this session and reset on reload.</p>
        </div>
      </dialog>
    </div>
  );
}
