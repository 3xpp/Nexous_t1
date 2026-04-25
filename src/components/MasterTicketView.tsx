import { useEffect, useRef } from 'preact/hooks';
import { ticketStore } from '../stores/ticketStore';
import { createTicketStream } from '../api';
import { Header } from './Header';
import { ReviewerLayout } from './ReviewerLayout';
import { LeadLayout } from './LeadLayout';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

interface MasterTicketViewProps {
  projectId: string;
}

export function MasterTicketView({ projectId }: MasterTicketViewProps) {
  useKeyboardShortcuts();
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);

  useEffect(() => {
    ticketStore.init();

    function connect() {
      const es = createTicketStream(
        projectId,
        (delta) => ticketStore.applyDelta(delta),
        () => {
          es.close();
          const delay = Math.min(reconnectDelayRef.current, MAX_RECONNECT_DELAY);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, MAX_RECONNECT_DELAY);
            connect();
          }, delay);
        }
      );
      ticketStore.sseConnection.value = es;
      reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;

      es.addEventListener('open', () => {
        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
      });
    }

    connect();

    return () => {
      ticketStore.sseConnection.value?.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [projectId]);

  const mode = ticketStore.mode.value;
  const reconnecting = reconnectDelayRef.current !== null && reconnectDelayRef.current > INITIAL_RECONNECT_DELAY;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Header projectId={projectId} reconnecting={reconnecting} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mode === 'reviewer' ? <ReviewerLayout /> : <LeadLayout projectId={projectId} />}
      </div>
    </div>
  );
}
