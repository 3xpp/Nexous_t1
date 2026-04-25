import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { QueuePane } from '../../src/components/QueuePane';
import { ticketStore } from '../../src/stores/ticketStore';
import type { TicketSummary } from '../../src/types';

describe('QueuePane', () => {
  beforeEach(() => {
    ticketStore.reset();
  });

  it('renders empty state when no tickets', () => {
    render(<QueuePane />);
    const list = screen.getByRole('list');
    expect(list.children.length).toBe(0);
  });

  it('renders ticket list when tickets provided', () => {
    const ticket: TicketSummary = {
      ticket_id: 'TC-001',
      requirement_id: 'REQ-SYS-040',
      requirement_summary: 'Brake light shall illuminate',
      asil: 'B',
      model_name: 'llama',
      model_version: '3.1',
      generation_score: 0.91,
      status: 'draft',
      reviewer_id: null,
      created_at: '2026-04-20T08:30:00Z',
      updated_at: '2026-04-20T08:30:00Z',
      draft_version: 1
    };
    ticketStore.tickets.value = new Map([['TC-001', ticket]]);
    render(<QueuePane />);
    expect(screen.getByText('TC-001')).toBeTruthy();
    expect(screen.getByText(/Brake light/)).toBeTruthy();
  });
});
