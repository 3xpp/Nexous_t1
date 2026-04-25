import { useEffect, useRef } from 'preact/hooks';
import { ticketStore } from '../stores/ticketStore';
import { createTicketStream } from '../api';
import { Header } from './Header';
import { ReviewerLayout } from './ReviewerLayout';
import { LeadLayout } from './LeadLayout';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface MasterTicketViewProps {
  projectId: string;
}

export function MasterTicketView({ projectId }: MasterTicketViewProps) {
  useKeyboardShortcuts();
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectDelayRef = useRef(1000);

  useEffect(() => {
    ticketStore.init();

    function connect() {
      const es = createTicketStream(
        projectId,
        (delta) => ticketStore.applyDelta(delta),
        () => {
          es.close();
          const delay = Math.min(reconnectDelayRef.current, 30000);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 30000);
            connect();
          }, delay);
        }
      );
      ticketStore.sseConnection.value = es;
      reconnectDelayRef.current = 1000;

      es.addEventListener('open', () => {
        reconnectDelayRef.current = 1000;
      });
    }

    connect();

    return () => {
      ticketStore.sseConnection.value?.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [projectId]);

  const mode = ticketStore.mode.value;
  const reconnecting = reconnectDelayRef.current !== null && reconnectDelayRef.current > 1000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Header projectId={projectId} reconnecting={reconnecting} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mode === 'reviewer' ? <ReviewerLayout /> : <LeadLayout projectId={projectId} />}
      </div>
    </div>
  );
}
