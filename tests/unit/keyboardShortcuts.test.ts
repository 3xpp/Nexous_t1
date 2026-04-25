import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/preact';
import { useKeyboardShortcuts } from '../../src/hooks/useKeyboardShortcuts';
import { ticketStore } from '../../src/stores/ticketStore';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    ticketStore.reset();
  });

  it('toggles mode on M key', () => {
    ticketStore.setMode('reviewer');
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    const event = new KeyboardEvent('keydown', { key: 'm' });
    window.dispatchEvent(event);

    expect(ticketStore.mode.value).toBe('lead');

    const event2 = new KeyboardEvent('keydown', { key: 'M' });
    window.dispatchEvent(event2);

    expect(ticketStore.mode.value).toBe('reviewer');

    unmount();
  });

  it('ignores non-shortcut keys', () => {
    ticketStore.setMode('reviewer');
    const { unmount } = renderHook(() => useKeyboardShortcuts());

    const event = new KeyboardEvent('keydown', { key: 'x' });
    window.dispatchEvent(event);

    expect(ticketStore.mode.value).toBe('reviewer');

    unmount();
  });
});
