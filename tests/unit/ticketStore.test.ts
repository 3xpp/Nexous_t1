import { describe, it, expect, beforeEach } from 'vitest';
import { ticketStore } from '../../src/stores/ticketStore';
import type { TicketDelta, TicketSummary } from '../../src/types';

describe('ticketStore', () => {
  beforeEach(() => {
    ticketStore.reset();
    localStorage.clear();
  });

  it('defaults mode to reviewer', () => {
    expect(ticketStore.mode.value).toBe('reviewer');
  });

  it('reads mode from localStorage on init', () => {
    localStorage.setItem('nexous-ticket-mode', 'lead');
    ticketStore.init();
    expect(ticketStore.mode.value).toBe('lead');
  });

  it('persists mode to localStorage on change', () => {
    ticketStore.setMode('lead');
    expect(localStorage.getItem('nexous-ticket-mode')).toBe('lead');
  });

  it('merges create delta into tickets map', () => {
    const delta: TicketDelta = {
      ticket_id: 't1',
      action: 'create',
      payload: { ticket_id: 't1', requirement_summary: 'Test brake light', status: 'draft', draft_version: 1 } as TicketSummary,
      timestamp: '2026-04-25T10:00:00Z'
    };
    ticketStore.applyDelta(delta);
    expect(ticketStore.tickets.value.has('t1')).toBe(true);
    expect(ticketStore.tickets.value.get('t1')?.requirement_summary).toBe('Test brake light');
  });

  it('merges update delta into existing ticket', () => {
    const create: TicketDelta = { ticket_id: 't1', action: 'create', payload: { ticket_id: 't1', status: 'draft' } as TicketSummary, timestamp: '2026-04-25T10:00:00Z' };
    const update: TicketDelta = { ticket_id: 't1', action: 'update', payload: { status: 'approved' }, timestamp: '2026-04-25T10:01:00Z' };
    ticketStore.applyDelta(create);
    ticketStore.applyDelta(update);
    expect(ticketStore.tickets.value.get('t1')?.status).toBe('approved');
  });

  it('deletes ticket on delete delta', () => {
    const create: TicketDelta = { ticket_id: 't1', action: 'create', payload: { ticket_id: 't1', status: 'draft' } as TicketSummary, timestamp: '2026-04-25T10:00:00Z' };
    ticketStore.applyDelta(create);
    ticketStore.applyDelta({ ticket_id: 't1', action: 'delete', payload: {}, timestamp: '2026-04-25T10:01:00Z' });
    expect(ticketStore.tickets.value.has('t1')).toBe(false);
  });
});
