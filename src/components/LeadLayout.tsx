import { DashboardPane } from './DashboardPane';
import { FilteredQueueTable } from './FilteredQueueTable';

interface LeadLayoutProps {
  projectId: string;
}

export function LeadLayout({ projectId }: LeadLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DashboardPane projectId={projectId} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <FilteredQueueTable />
      </div>
    </div>
  );
}
