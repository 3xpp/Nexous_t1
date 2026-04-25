import { useEffect } from 'preact/hooks';
import { ticketStore } from '../stores/ticketStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'M' || e.key === 'm') {
        e.preventDefault();
        ticketStore.setMode(ticketStore.mode.value === 'reviewer' ? 'lead' : 'reviewer');
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
