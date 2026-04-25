import { signal, computed } from '@preact/signals';
import type { Mode, TicketSummary, TicketDelta, FilterState } from '../types';

const STORAGE_KEY = 'nexous-ticket-mode';

export interface TicketStore {
  mode: ReturnType<typeof signal<Mode>>;
  selectedId: ReturnType<typeof signal<string | null>>;
  tickets: ReturnType<typeof signal<Map<string, TicketSummary>>>;
  filters: ReturnType<typeof signal<FilterState>>;
  sseConnection: ReturnType<typeof signal<EventSource | null>>;
  filteredTickets: ReturnType<typeof computed<TicketSummary[]>>;
  setMode: (mode: Mode) => void;
  selectTicket: (id: string | null) => void;
  applyDelta: (delta: TicketDelta) => void;
  init: () => void;
  reset: () => void;
  connectStream: () => void;
  disconnectStream: () => void;
}

function createTicketStore(): TicketStore {
  const mode = signal<Mode>('reviewer');
  const selectedId = signal<string | null>(null);
  const tickets = signal<Map<string, TicketSummary>>(new Map());
  const filters = signal<FilterState>({ project_id: 'default', status: 'all', asil: 'all', reviewer_id: 'all', search: '' });
  const sseConnection = signal<EventSource | null>(null);
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectDelay = 1000;
  const INITIAL_RECONNECT_DELAY = 1000;
  const MAX_RECONNECT_DELAY = 30000;

  const filteredTickets = computed(() => {
    const list = Array.from(tickets.value.values());
    const f = filters.value;
    return list.filter((t: TicketSummary) => {
      if (f.status !== 'all' && t.status !== f.status) return false;
      if (f.asil !== 'all' && t.asil !== f.asil) return false;
      if (f.reviewer_id !== 'all' && t.reviewer_id !== f.reviewer_id) return false;
      if (f.search) {
        const s = f.search.toLowerCase();
        if (!t.requirement_summary.toLowerCase().includes(s) && !t.ticket_id.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  });

  function setMode(newMode: Mode) {
    mode.value = newMode;
    localStorage.setItem(STORAGE_KEY, newMode);
  }

  function selectTicket(id: string | null) {
    selectedId.value = id;
  }

  function applyDelta(delta: TicketDelta) {
    const next = new Map(tickets.value);
    if (delta.action === 'delete') {
      next.delete(delta.ticket_id);
    } else if (delta.action === 'create') {
      next.set(delta.ticket_id, delta.payload as TicketSummary);
    } else if (delta.action === 'update') {
      const existing = next.get(delta.ticket_id);
      if (existing) {
        next.set(delta.ticket_id, { ...existing, ...delta.payload });
      }
    }
    tickets.value = next;
  }

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (stored === 'reviewer' || stored === 'lead') {
      mode.value = stored;
    }
  }

  function disconnectStream() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    sseConnection.value?.close();
    sseConnection.value = null;
  }

  function connectStream() {
    disconnectStream();
    const projectId = filters.value.project_id;
    const es = new EventSource(`/api/tickets/stream?project=${encodeURIComponent(projectId)}`);
    es.addEventListener('open', () => {
      reconnectDelay = INITIAL_RECONNECT_DELAY;
    });
    es.addEventListener('ticket_delta', (e: MessageEvent) => {
      const delta = JSON.parse(e.data);
      applyDelta(delta);
    });
    es.addEventListener('error', () => {
      disconnectStream();
      const delay = reconnectDelay;
      reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
      reconnectTimer = setTimeout(() => {
        connectStream();
      }, delay);
    });
    sseConnection.value = es;
  }

  function reset() {
    mode.value = 'reviewer';
    selectedId.value = null;
    tickets.value = new Map();
    filters.value = { project_id: 'default', status: 'all', asil: 'all', reviewer_id: 'all', search: '' };
    disconnectStream();
  }

  return { mode, selectedId, tickets, filters, sseConnection, filteredTickets, setMode, selectTicket, applyDelta, init, reset, connectStream, disconnectStream };
}

export const ticketStore = createTicketStore();
