import { ticketDetailStore } from '../stores/ticketDetailStore';

export function RequirementTab() {
  const text = ticketDetailStore.ticket.value?.requirement_text;
  if (!text) return <p style={{ padding: '16px', color: '#6b7280' }}>No requirement loaded.</p>;

  return (
    <div style={{ padding: '16px' }}>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
        {text}
      </pre>
    </div>
  );
}
