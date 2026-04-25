import { describe, it, expect } from 'vitest';
import { allTickets, ticketById } from '../fixtures';
import type { TicketDetail, AsilLevel, TicketStatus } from '../../src/types';

const ASILS: AsilLevel[] = ['QM', 'A', 'B', 'C', 'D'];
const STATUSES: TicketStatus[] = ['draft', 'pending', 'approved', 'rejected', 'draft_low_confidence'];

describe('fixture data', () => {
  it('has 20 tickets', () => {
    expect(allTickets.length).toBe(20);
  });

  it('each ticket has required fields', () => {
    for (const t of allTickets) {
      expect(t.ticket_id).toMatch(/^TC-\d{3}$/);
      expect(t.requirement_id).toMatch(/^REQ-SYS-\d{3}$/);
      expect(t.requirement_summary.length).toBeGreaterThan(10);
      expect(t.generation_score).toBeGreaterThanOrEqual(0);
      expect(t.generation_score).toBeLessThanOrEqual(1);
      expect(t.draft_version).toBeGreaterThanOrEqual(1);
      expect(t.draft_content.length).toBeGreaterThan(50);
      expect(t.requirement_text.length).toBeGreaterThan(50);
    }
  });

  it('covers all ASIL levels', () => {
    const found = new Set(allTickets.map(t => t.asil));
    for (const a of ASILS) {
      expect(found).toContain(a);
    }
  });

  it('covers all statuses', () => {
    const found = new Set(allTickets.map(t => t.status));
    for (const s of STATUSES) {
      expect(found).toContain(s);
    }
  });

  it('has varying draft versions', () => {
    const versions = new Set(allTickets.map(t => t.draft_version));
    expect(versions.size).toBeGreaterThan(1);
  });

  it('has mixed reviewer assignments', () => {
    const hasReviewer = allTickets.some(t => t.reviewer_id !== null);
    const hasUnassigned = allTickets.some(t => t.reviewer_id === null);
    expect(hasReviewer).toBe(true);
    expect(hasUnassigned).toBe(true);
  });

  it('ticketById works', () => {
    const t = ticketById('TC-001');
    expect(t).toBeDefined();
    expect(t?.ticket_id).toBe('TC-001');
    expect(ticketById('NONEXISTENT')).toBeUndefined();
  });

  it('has realistic timestamps', () => {
    for (const t of allTickets) {
      const created = new Date(t.created_at);
      const updated = new Date(t.updated_at);
      expect(created.getFullYear()).toBe(2026);
      expect(updated >= created).toBe(true);
    }
  });
});
