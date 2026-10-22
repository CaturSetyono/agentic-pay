export interface AgentEvent { id: number; time: string; stage: string; message: string }
export function AgentStream({ events }: { events: AgentEvent[] }) {
  return <aside className="agent-stream"><div className="section-heading"><h2><span className="status-dot" /> Live Agent Thought Stream</h2><span>Execution log · this session</span></div><ol role="log" aria-live="polite" aria-label="Agent execution events" aria-relevant="additions">{events.length === 0 && <li className="muted-text">Ready to perceive your first invoice. Select a preset and run an audit.</li>}{events.map(event => <li key={event.id}><time dateTime={event.time}>{new Date(event.time).toLocaleTimeString('en-GB')}</time><span className="pill indigo">{event.stage}</span><span>{event.message}</span></li>)}</ol></aside>;
}
