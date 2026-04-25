import { signal } from '@preact/signals';
import type { TicketDetail } from '../types';
import { fetchTicket, fetchAuditSummary, approveTicket, rejectTicket, ConflictError } from '../api';

export interface TicketDetailStore {
  ticket: ReturnType<typeof signal<TicketDetail | null>>;
  loading: ReturnType<typeof signal<boolean>>;
  error: ReturnType<typeof signal<string | null>>;
  draftVersion: ReturnType<typeof signal<number>>;
  mergeState: ReturnType<typeof signal<{ latestVersion: number } | null>>;
  selectTicket: (id: string) => Promise<void>;
  approve: () => Promise<void>;
  reject: () => Promise<void>;
  resolveMerge: (latestVersion: number) => void;
  reset: () => void;
}

function createTicketDetailStore(): TicketDetailStore {
  const ticket = signal<TicketDetail | null>(null);
  const loading = signal(false);
  const error = signal<string | null>(null);
  const draftVersion = signal(0);
  const mergeState = signal<{ latestVersion: number } | null>(null);

  async function selectTicket(id: string) {
    loading.value = true;
    error.value = null;
    mergeState.value = null;
    try {
      const [detail] = await Promise.all([fetchTicket(id), fetchAuditSummary(id)]);
      ticket.value = detail;
      draftVersion.value = detail.draft_version;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  async function approve() {
    const id = ticket.value?.ticket_id;
    const version = draftVersion.value;
    if (!id) return;
    try {
      await approveTicket(id, version);
    } catch (err) {
      if (err instanceof ConflictError) {
        mergeState.value = { latestVersion: err.latestVersion };
      } else {
        error.value = err instanceof Error ? err.message : 'Unknown error';
      }
    }
  }

  async function reject() {
    const id = ticket.value?.ticket_id;
    const version = draftVersion.value;
    if (!id) return;
    try {
      await rejectTicket(id, version);
    } catch (err) {
      if (err instanceof ConflictError) {
        mergeState.value = { latestVersion: err.latestVersion };
      } else {
        error.value = err instanceof Error ? err.message : 'Unknown error';
      }
    }
  }

  function resolveMerge(latestVersion: number) {
    draftVersion.value = latestVersion;
    mergeState.value = null;
  }

  function reset() {
    ticket.value = null;
    loading.value = false;
    error.value = null;
    draftVersion.value = 0;
    mergeState.value = null;
  }

  return { ticket, loading, error, draftVersion, mergeState, selectTicket, approve, reject, resolveMerge, reset };
}

export const ticketDetailStore = createTicketDetailStore();
