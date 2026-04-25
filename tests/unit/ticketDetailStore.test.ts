import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ticketDetailStore } from '../../src/stores/ticketDetailStore';
import * as api from '../../src/api';
import type { TicketDetail } from '../../src/types';

vi.mock('../../src/api', () => ({
  fetchTicket: vi.fn(),
  fetchAuditSummary: vi.fn(),
  approveTicket: vi.fn(),
  rejectTicket: vi.fn(),
  ConflictError: class ConflictError extends Error {
    latestVersion: number;
    constructor(latestVersion: number) {
      super('Draft version conflict');
      this.latestVersion = latestVersion;
    }
  }
}));

describe('ticketDetailStore', () => {
  beforeEach(() => {
    ticketDetailStore.reset();
    vi.clearAllMocks();
  });

  it('loads ticket detail on select', async () => {
    const mockTicket: TicketDetail = {
      ticket_id: 't1', requirement_id: 'r1', requirement_summary: 'Brake light',
      asil: 'B', model_name: 'llama', model_version: '1.0', generation_score: 0.92,
      status: 'draft', reviewer_id: null, created_at: '', updated_at: '',
      draft_version: 3, draft_content: 'TC-001...', requirement_text: 'The brake light...',
      traceability_up: [], traceability_down: []
    };
    vi.mocked(api.fetchTicket).mockResolvedValue(mockTicket);
    vi.mocked(api.fetchAuditSummary).mockResolvedValue({ entries: [] });

    await ticketDetailStore.selectTicket('t1');
    expect(ticketDetailStore.ticket.value?.ticket_id).toBe('t1');
    expect(ticketDetailStore.draftVersion.value).toBe(3);
  });

  it('approves ticket and updates status', async () => {
    const mockTicket: TicketDetail = {
      ticket_id: 't1', requirement_id: 'r1', requirement_summary: 'Brake light',
      asil: 'B', model_name: 'llama', model_version: '1.0', generation_score: 0.92,
      status: 'draft', reviewer_id: null, created_at: '', updated_at: '',
      draft_version: 3, draft_content: 'TC-001...', requirement_text: 'The brake light...',
      traceability_up: [], traceability_down: []
    };
    vi.mocked(api.fetchTicket).mockResolvedValue(mockTicket);
    vi.mocked(api.fetchAuditSummary).mockResolvedValue({ entries: [] });
    vi.mocked(api.approveTicket).mockResolvedValue(undefined);

    await ticketDetailStore.selectTicket('t1');
    await ticketDetailStore.approve();
    expect(api.approveTicket).toHaveBeenCalledWith('t1', 3);
  });

  it('handles 409 conflict by setting merge state', async () => {
    const mockTicket: TicketDetail = {
      ticket_id: 't1', requirement_id: 'r1', requirement_summary: 'Brake light',
      asil: 'B', model_name: 'llama', model_version: '1.0', generation_score: 0.92,
      status: 'draft', reviewer_id: null, created_at: '', updated_at: '',
      draft_version: 3, draft_content: 'TC-001...', requirement_text: 'The brake light...',
      traceability_up: [], traceability_down: []
    };
    vi.mocked(api.fetchTicket).mockResolvedValue(mockTicket);
    vi.mocked(api.fetchAuditSummary).mockResolvedValue({ entries: [] });
    vi.mocked(api.approveTicket).mockRejectedValue(new api.ConflictError(5));

    await ticketDetailStore.selectTicket('t1');
    await ticketDetailStore.approve();
    expect(ticketDetailStore.mergeState.value).toEqual({ latestVersion: 5 });
  });
});
