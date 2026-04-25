import type { TicketSummary } from '../types';

interface TicketRowProps {
  ticket: TicketSummary;
  isSelected: boolean;
  onSelect: (id: string) => void;
  density: 'compact' | 'comfortable';
  renderAs?: 'div' | 'tr';
}

const asilColors: Record<string, string> = {
  QM: '#6b7280',
  A: '#22c55e',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#ef4444'
};

const statusDots: Record<string, string> = {
  draft: '#9ca3af',
  pending: '#f59e0b',
  approved: '#22c55e',
  rejected: '#ef4444',
  draft_low_confidence: '#f97316'
};

export function TicketRow({ ticket, isSelected, onSelect, density, renderAs = 'div' }: TicketRowProps) {
  const isTr = renderAs === 'tr';
  const baseStyle: preact.JSX.CSSProperties = isTr ? {
    cursor: 'pointer',
    background: isSelected ? '#eff6ff' : 'transparent'
  } : {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: density === 'comfortable' ? '12px 16px' : '6px 12px',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    background: isSelected ? '#eff6ff' : 'transparent'
  };

  const content = (
    <>
      {!isTr && (
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: statusDots[ticket.status] || '#9ca3af',
          flexShrink: 0
        }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: density === 'comfortable' ? '4px' : '0' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{ticket.ticket_id}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: '3px',
            color: '#fff',
            background: asilColors[ticket.asil] || '#6b7280'
          }}>
            {ticket.asil}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>{ticket.model_name}@{ticket.model_version}</span>
          <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: 'auto' }}>{ticket.generation_score.toFixed(2)}</span>
        </div>
        {density === 'comfortable' && (
          <p style={{ margin: 0, fontSize: '13px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ticket.requirement_summary}
          </p>
        )}
      </div>
    </>
  );

  if (isTr) {
    return (
      <tr
        style={baseStyle}
        onClick={() => onSelect(ticket.ticket_id)}
      >
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: statusDots[ticket.status] || '#9ca3af'
            }} />
            <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{ticket.ticket_id}</span>
          </div>
        </td>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: '3px',
            color: '#fff',
            background: asilColors[ticket.asil] || '#6b7280'
          }}>
            {ticket.asil}
          </span>
        </td>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>{ticket.status}</td>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>{ticket.model_name}@{ticket.model_version}</td>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>{ticket.generation_score.toFixed(2)}</td>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>{ticket.reviewer_id ?? '—'}</td>
      </tr>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Ticket ${ticket.ticket_id} — ${ticket.requirement_summary}`}
      style={baseStyle}
      onClick={() => onSelect(ticket.ticket_id)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(ticket.ticket_id);
        }
      }}
    >
      {content}
    </div>
  );
}
