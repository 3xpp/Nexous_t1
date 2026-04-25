import { useEffect } from 'preact/hooks';
import { ticketStore } from '../stores/ticketStore';
import { Header } from './Header';
import { ReviewerLayout } from './ReviewerLayout';
import { LeadLayout } from './LeadLayout';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface MasterTicketViewProps {
  projectId: string;
}

export function MasterTicketView({ projectId }: MasterTicketViewProps) {
  useKeyboardShortcuts();

  useEffect(() => {
    ticketStore.init();
    ticketStore.connectStream();

    return () => {
      ticketStore.disconnectStream();
    };
  }, [projectId]);

  const mode = ticketStore.mode.value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Header reconnecting={false} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mode === 'reviewer' ? <ReviewerLayout /> : <LeadLayout projectId={projectId} />}
      </div>
    </div>
  );
}
