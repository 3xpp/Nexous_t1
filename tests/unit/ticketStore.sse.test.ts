import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ticketStore } from '../../src/stores/ticketStore';

describe('ticketStore SSE', () => {
  let eventSourceInstances: any[] = [];

  beforeEach(() => {
    ticketStore.reset();
    eventSourceInstances = [];

    global.EventSource = vi.fn().mockImplementation((url: string) => {
      const listeners: Record<string, Array<(e: Event) => void>> = {};
      const instance = {
        url,
        readyState: 0,
        close: vi.fn(),
        addEventListener: vi.fn((event: string, handler: (e: Event) => void) => {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(handler);
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn((event: Event) => {
          const handlers = listeners[event.type] || [];
          handlers.forEach((h) => h(event));
          return true;
        })
      };
      eventSourceInstances.push({ ...instance, _listeners: listeners });
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

    eventSourceInstances[0].dispatchEvent(new Event('error'));

    vi.advanceTimersByTime(1000);
    expect(global.EventSource).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
