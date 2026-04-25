import { ticketStore } from '../stores/ticketStore';
import type { TicketSummary } from '../types';
import { TicketRow } from './TicketRow';

export function FilteredQueueTable() {
  const tickets = ticketStore.filteredTickets.value;
  const selectedId = ticketStore.selectedId.value;

  return (
    <div style={{ height: '100%', overflow: 'auto', borderTop: '1px solid #e5e7eb' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#6b7280' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#6b7280' }}>ASIL</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#6b7280' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#6b7280' }}>Model</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#6b7280' }}>Score</th>
            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500, color: '#6b7280' }}>Reviewer</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket: TicketSummary) => (
            <tr
              key={ticket.ticket_id}
              onClick={() => ticketStore.selectTicket(ticket.ticket_id)}
              style={{
                cursor: 'pointer',
                background: ticket.ticket_id === selectedId ? '#eff6ff' : 'transparent'
              }}
            >
              <TicketRow ticket={ticket} isSelected={ticket.ticket_id === selectedId} onSelect={() => {}} density="compact" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
