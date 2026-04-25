import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ticketStore } from '../../src/stores/ticketStore';

describe('ticketStore SSE', () => {
  let eventSourceInstances: any[] = [];

  beforeEach(() => {
    ticketStore.reset();
    eventSourceInstances = [];

    global.EventSource = vi.fn().mockImplementation((url: string) => {
      const instance = {
        url,
        readyState: 0,
        onopen: null as ((e: Event) => void) | null,
        onmessage: null as ((e: MessageEvent) => void) | null,
        onerror: null as ((e: Event) => void) | null,
        close: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      };
      eventSourceInstances.push(instance);
      return instance;
    }) as any;
  });

  afterEach(() => {
    ticketStore.reset();
    vi.restoreAllMocks();
  });

  it('creates EventSource on connect', () => {
    ticketStore.connectStream();
    expect(global.EventSource).toHaveBeenCalledTimes(1);
    expect(eventSourceInstances[0].url).toContain('/api/tickets/stream');
  });

  it('closes existing connection before reconnecting', () => {
    ticketStore.connectStream();
    const first = eventSourceInstances[0];
    ticketStore.connectStream();
    expect(first.close).toHaveBeenCalled();
    expect(global.EventSource).toHaveBeenCalledTimes(2);
  });

  it('reconnects after error', () => {
    vi.useFakeTimers();
    ticketStore.connectStream();
    expect(global.EventSource).toHaveBeenCalledTimes(1);

    if (eventSourceInstances[0].onerror) {
      eventSourceInstances[0].onerror(new Event('error'));
    }

    vi.advanceTimersByTime(5000);
    expect(global.EventSource).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
