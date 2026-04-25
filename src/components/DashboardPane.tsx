import { useEffect, useState } from 'preact/hooks';
import { fetchMetrics } from '../api';
import type { TicketMetrics } from '../types';

interface DashboardPaneProps {
  projectId: string;
}

export function DashboardPane({ projectId }: DashboardPaneProps) {
  const [metrics, setMetrics] = useState<TicketMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchMetrics(projectId)
      .then((m) => { if (!cancelled) { setMetrics(m); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [projectId]);

  if (loading || !metrics) {
    return (
      <div style={{ height: '280px', padding: '16px', display: 'flex', gap: '16px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px' }} />
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Total Drafts', value: metrics.total_drafts },
    { label: 'Pending', value: metrics.pending_approval },
    { label: 'Approved Today', value: metrics.approved_today },
    { label: 'Rejected Today', value: metrics.rejected_today },
    { label: 'Avg Review (min)', value: metrics.avg_review_time_minutes }
  ];

  return (
    <div style={{ height: '280px', padding: '16px', display: 'flex', gap: '16px', borderBottom: '1px solid #e5e7eb' }}>
      {cards.map((card) => (
        <div key={card.label} style={{ flex: 1, background: '#f9fafb', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{card.label}</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>{card.value}</div>
        </div>
      ))}
      <div style={{
        width: '120px',
        background: metrics.audit_chain_healthy ? '#dcfce7' : '#fee2e2',
        borderRadius: '8px',
        padding: '16px',
        border: `1px solid ${metrics.audit_chain_healthy ? '#86efac' : '#fecaca'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: 600,
        color: metrics.audit_chain_healthy ? '#166534' : '#991b1b'
      }}>
        {metrics.audit_chain_healthy ? 'Chain Healthy' : 'Chain Broken'}
      </div>
    </div>
  );
}
