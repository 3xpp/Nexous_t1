import { useEffect, useState } from 'preact/hooks';
import { ticketStore } from '../stores/ticketStore';
import { ticketDetailStore } from '../stores/ticketDetailStore';
import { SkeletonShimmer } from './SkeletonShimmer';
import { DraftTab } from './DraftTab';
import { RequirementTab } from './RequirementTab';
import { TraceabilityTab } from './TraceabilityTab';
import { AuditTab } from './AuditTab';

const TABS = [
  { key: 'draft', label: 'Draft', shortcut: '1' },
  { key: 'requirement', label: 'Requirement', shortcut: '2' },
  { key: 'traceability', label: 'Traceability', shortcut: '3' },
  { key: 'audit', label: 'Audit', shortcut: '4' }
] as const;

type TabKey = typeof TABS[number]['key'];

export function TicketDetailPane() {
  const ticketId = ticketStore.selectedId.value;
  const loading = ticketDetailStore.loading.value;
  const [activeTab, setActiveTab] = useState<TabKey>('draft');

  useEffect(() => {
    if (ticketId) {
      ticketDetailStore.selectTicket(ticketId);
    } else {
      ticketDetailStore.reset();
    }
  }, [ticketId]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === '1') setActiveTab('draft');
      if (e.key === '2') setActiveTab('requirement');
      if (e.key === '3') setActiveTab('traceability');
      if (e.key === '4') setActiveTab('audit');
      if (e.key === 'Escape') {
        // return focus to queue — handled by QueuePane focus
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!ticketId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '14px' }}>
        Select a ticket from the queue
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              border: 'none',
              background: activeTab === tab.key ? '#fff' : 'transparent',
              borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 600 : 400
            }}
          >
            {tab.label} ({tab.shortcut})
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading && activeTab !== 'audit' ? <SkeletonShimmer lines={5} /> : (
          <>
            {activeTab === 'draft' && <DraftTab />}
            {activeTab === 'requirement' && <RequirementTab />}
            {activeTab === 'traceability' && <TraceabilityTab />}
            {activeTab === 'audit' && <AuditTab />}
          </>
        )}
      </div>
    </div>
  );
}
