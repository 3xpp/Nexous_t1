import { useEffect, useRef } from 'preact/hooks';
import { ticketStore } from '../stores/ticketStore';
import type { TicketSummary } from '../types';
import { TicketRow } from './TicketRow';

export function QueuePane() {
  const tickets = ticketStore.filteredTickets.value;
  const selectedId = ticketStore.selectedId.value;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (document.activeElement?.tagName === 'INPUT') return;
      const idx = tickets.findIndex((t: TicketSummary) => t.ticket_id === selectedId);
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = tickets[Math.min(idx + 1, tickets.length - 1)];
        if (next) ticketStore.selectTicket(next.ticket_id);
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = tickets[Math.max(idx - 1, 0)];
        if (prev) ticketStore.selectTicket(prev.ticket_id);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedId) ticketStore.selectTicket(selectedId);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tickets, selectedId]);

  return (
    <div ref={listRef} style={{ height: '100%', overflow: 'auto' }}>
      {tickets.map((ticket: TicketSummary) => (
        <TicketRow
          key={ticket.ticket_id}
          ticket={ticket}
          isSelected={ticket.ticket_id === selectedId}
          onSelect={(id) => ticketStore.selectTicket(id)}
          density="comfortable"
        />
      ))}
    </div>
  );
}
