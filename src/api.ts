import type { TicketDetail, TicketMetrics, AuditEntry, TicketDelta } from './types';

const API_BASE = '/api';

export async function fetchTicket(ticketId: string): Promise<TicketDetail> {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`);
  if (!res.ok) throw new Error(`fetchTicket failed: ${res.status}`);
  return res.json();
}

export async function fetchAuditSummary(ticketId: string): Promise<{ entries: AuditEntry[] }> {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/audit-summary`);
  if (!res.ok) throw new Error(`fetchAuditSummary failed: ${res.status}`);
  return res.json();
}

export async function fetchMetrics(projectId: string): Promise<TicketMetrics> {
  const res = await fetch(`${API_BASE}/tickets/metrics?project=${encodeURIComponent(projectId)}`);
  if (!res.ok) throw new Error(`fetchMetrics failed: ${res.status}`);
  return res.json();
}

export async function approveTicket(ticketId: string, draftVersion: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft_version: draftVersion })
  });
  if (res.status === 409) {
    const body = await res.json();
    throw new ConflictError(body.latest_version);
  }
  if (!res.ok) throw new Error(`approveTicket failed: ${res.status}`);
}

export async function rejectTicket(ticketId: string, draftVersion: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft_version: draftVersion })
  });
  if (res.status === 409) {
    const body = await res.json();
    throw new ConflictError(body.latest_version);
  }
  if (!res.ok) throw new Error(`rejectTicket failed: ${res.status}`);
}

export class ConflictError extends Error {
  latestVersion: number;
  constructor(latestVersion: number) {
    super('Draft version conflict');
    this.latestVersion = latestVersion;
  }
}

export function createTicketStream(
  projectId: string,
  onDelta: (delta: TicketDelta) => void,
  onError: (err: Event) => void
): EventSource {
  const es = new EventSource(`${API_BASE}/tickets/stream?project=${encodeURIComponent(projectId)}`);
  es.addEventListener('ticket_delta', (e) => {
    onDelta(JSON.parse(e.data));
  });
  es.addEventListener('error', onError);
  return es;
}
