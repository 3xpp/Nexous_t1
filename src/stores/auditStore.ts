import { signal } from '@preact/signals';
import type { AuditEntry } from '../types';
import { fetchAuditSummary } from '../api';

export interface AuditStore {
  entries: ReturnType<typeof signal<AuditEntry[]>>;
  loading: ReturnType<typeof signal<boolean>>;
  error: ReturnType<typeof signal<string | null>>;
  loadChain: (ticketId: string) => Promise<void>;
  reset: () => void;
}

function createAuditStore(): AuditStore {
  const entries = signal<AuditEntry[]>([]);
  const loading = signal(false);
  const error = signal<string | null>(null);

  async function loadChain(ticketId: string) {
    if (entries.value.length > 0) return;
    loading.value = true;
    error.value = null;
    try {
      const result = await fetchAuditSummary(ticketId);
      entries.value = result.entries;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    entries.value = [];
    loading.value = false;
    error.value = null;
  }

  return { entries, loading, error, loadChain, reset };
}

export const auditStore = createAuditStore();
