import { signal } from '@preact/signals';
import type { TicketMetrics } from '../types';
import { fetchMetrics } from '../api';

export interface MetricsStore {
  data: ReturnType<typeof signal<TicketMetrics | null>>;
  loading: ReturnType<typeof signal<boolean>>;
  error: ReturnType<typeof signal<string | null>>;
  load: (projectId: string) => Promise<void>;
  reset: () => void;
}

function createMetricsStore(): MetricsStore {
  const data = signal<TicketMetrics | null>(null);
  const loading = signal(false);
  const error = signal<string | null>(null);

  async function load(projectId: string) {
    loading.value = true;
    error.value = null;
    try {
      const m = await fetchMetrics(projectId);
      data.value = m;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load metrics';
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    data.value = null;
    loading.value = false;
    error.value = null;
  }

  return { data, loading, error, load, reset };
}

export const metricsStore = createMetricsStore();
