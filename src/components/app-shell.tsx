"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Activity, ArrowDownLeft, ArrowRight, BadgeCheck, Check, ChevronRight, CircleDollarSign, Command, FileCheck2, Layers3, LockKeyhole, Moon, Radar, Settings2, ShieldCheck, Sparkles, Sun, Wallet, X } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

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
  const ViewIcon = view.icon;
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % views.length
      : event.key === "ArrowLeft" ? (index + views.length - 1) % views.length
      : event.key === "Home" ? 0 : event.key === "End" ? views.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); setActive(next); tabRefs.current[next]?.focus();
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace">Skip to workspace</a>
      <header className="topbar">
        <a className="brand" href="/" aria-label="AgenticPay home"><span className="brand-icon"><Layers3 size={22} /></span><span><strong>AgenticPay<span className="brand-dot">.</span></strong><small>Autonomous Commerce Mesh</small></span></a>
        <div className="header-actions"><Clock /><div className="header-divider" /><button className="icon-button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`} title="Toggle theme">{resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button><button className="icon-button" onClick={() => settings.current?.showModal()} aria-label="Open settings" title="Settings"><Settings2 size={18} /></button><span className="avatar" aria-label="Workspace avatar">AP</span></div>
      </header>
      <main id="workspace">
        <div className="breadcrumb"><span>Workspace</span><ChevronRight size={12} /><span>Commerce overview</span></div>
        <section className="page-heading"><div><div className="eyebrow"><span className="status-dot" /> YOUR AUTONOMOUS WORKSPACE</div><h1>Commerce, on autopilot.</h1><p>From invoice to settlement. Every decision accounted for.</p></div><div className="sandbox-badge"><span className="paypal-mark">P</span><span><strong><span className="status-dot" /> PayPal Sandbox Active</strong><small>Client ID: Sandbox-AutoMesh</small></span></div></section>
        <section className="metrics" aria-label="Workspace metrics">
          <article className="metric"><div className="metric-label">Autonomous Budget Cap<Wallet size={16} /></div><div className="metric-value">$7,500.00<span>/ month</span></div><div className="budget-track" role="progressbar" aria-label="Monthly budget used" aria-valuenow={48} aria-valuemin={0} aria-valuemax={100}><span /></div><div className="metric-foot"><span>48% used</span><span>$3,900.00 remaining</span></div></article>
          <article className="metric"><div className="metric-label">Invoices Audited<FileCheck2 size={16} /></div><div className="metric-value">142<span>processed</span></div><div className="metric-note"><span className="pill green"><BadgeCheck size={12} />99.1%</span><span>accuracy score</span></div><div className="metric-foot"><span>Precision at every step</span></div></article>
          <article className="metric"><div className="metric-label">Settled via PayPal<ArrowDownLeft size={16} /></div><div className="metric-value">$3,820.00</div><div className="metric-note"><span className="pill indigo">USD</span><span>sandbox settled</span></div><div className="metric-foot"><span>Sandbox environment only</span></div></article>
          <article className="metric"><div className="metric-label">Policy Guardrails<ShieldCheck size={16} /></div><div className="metric-value">3<span>active rules</span></div><div className="metric-note"><span className="pill green"><Check size={12} />0 violations</span></div><div className="metric-foot"><span>Within configured boundaries</span></div></article>
        </section>
        <div className="section-heading"><h2>Commerce workspace</h2><span><span className="mini-dot" />Demo data · Foundation preview</span></div>
        <div className="view-tabs" role="tablist" aria-label="Commerce views">
          {views.map((item, index) => { const Icon = item.icon; return <button key={item.stage} ref={(element) => { tabRefs.current[index] = element; }} id={`tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`panel-${index}`} tabIndex={active === index ? 0 : -1} className={cn("view-tab", active === index && "selected")} onClick={() => setActive(index)} onKeyDown={(event) => navigateTabs(event, index)}><span className="tab-icon"><Icon size={19} /></span><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><span className="tab-number">0{index + 1}</span></button>; })}
        </div>
        <section className="workspace-panel" role="tabpanel" tabIndex={0} id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
          <div className="panel-heading"><div><span className="eyebrow">{view.stage} / {view.label.toUpperCase()}</span><h2>{view.description}</h2><p>{view.detail}</p></div><span className="pill muted"><Command size={12} />Foundation</span></div>
          <div className="panel-grid"><div className="empty-state"><div className="radar-art" aria-hidden="true"><div className="radar-orbit" /><div className="radar-core"><ViewIcon size={30} strokeWidth={1.4} /></div><span className="radar-spark"><Sparkles size={13} /></span></div><h3>{view.empty}</h3><p>{view.hint}</p><span className="coming-soon">Module in development<ArrowRight size={14} /></span></div><aside className="workflow"><div className="workflow-title"><Activity size={15} /><h3>How it flows</h3></div><p>A deliberate path to autonomous commerce.</p><ol>{view.steps.map((step, index) => <li key={step}><span className="step-number">{index + 1}</span><div><strong>{step}</strong><small>{["Structured inputs, clear context", "Checks before every decision", "Traceable results, by design"][index]}</small></div></li>)}</ol><div className="workflow-note"><LockKeyhole size={15} /><span>Built for oversight.<br /><strong>Designed for autonomy.</strong></span></div></aside></div>
          <div className="panel-footer"><span><ShieldCheck size={14} />Human oversight. Agent execution.</span><span className="pill amber">Loop 01 / 05</span></div>
        </section>
        <footer className="page-footer"><span><Layers3 size={14} />AgenticPay <span className="footer-separator">/</span> Autonomous Commerce Mesh</span><span>UI preview · PayPal API not connected</span></footer>
      </main>
      <dialog ref={settings} className="settings-dialog" aria-labelledby="settings-title" onClick={(event) => { if (event.target === event.currentTarget) settings.current?.close(); }}><div className="dialog-heading"><div><span className="eyebrow">WORKSPACE PREFERENCES</span><h2 id="settings-title">Settings</h2></div><button className="icon-button" aria-label="Close settings" onClick={() => settings.current?.close()}><X size={20} /></button></div><label htmlFor="theme-select">Appearance</label><p>Choose a theme or follow your device’s preference.</p><select id="theme-select" value={theme} onChange={(event) => setTheme(event.target.value as Theme)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select><div className="settings-note"><ShieldCheck size={18} /><p>Foundation preview. Metrics are sample data; the PayPal sandbox connection will be implemented in a later loop.</p></div></dialog>
    </div>
  );
}
