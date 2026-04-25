import { ticketDetailStore } from '../stores/ticketDetailStore';
import type { TraceLink } from '../types';

export function TraceabilityTab() {
  const ticket = ticketDetailStore.ticket.value;
  if (!ticket) return <p style={{ padding: '16px', color: '#6b7280' }}>No ticket loaded.</p>;

  return (
    <div style={{ padding: '16px' }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Upstream</h4>
      {ticket.traceability_up.length === 0 && <p style={{ color: '#6b7280', fontSize: '13px' }}>No upstream links.</p>}
      {ticket.traceability_up.map((link: TraceLink) => (
        <div key={link.artifact_id} style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{link.artifact_id}</span>
          <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>{link.link_type}</span>
        </div>
      ))}

      <h4 style={{ margin: '24px 0 12px 0', fontSize: '14px' }}>Downstream</h4>
      {ticket.traceability_down.length === 0 && <p style={{ color: '#6b7280', fontSize: '13px' }}>No downstream links.</p>}
      {ticket.traceability_down.map((link: TraceLink) => (
        <div key={link.artifact_id} style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{link.artifact_id}</span>
          <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>{link.link_type}</span>
        </div>
      ))}
    </div>
  );
}
