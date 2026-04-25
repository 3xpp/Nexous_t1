import { useEffect } from 'preact/hooks';
import { metricsStore } from '../stores/metricsStore';

interface DashboardPaneProps {
  projectId: string;
}

export function DashboardPane({ projectId }: DashboardPaneProps) {
  const metrics = metricsStore.data.value;
  const loading = metricsStore.loading.value;

  useEffect(() => {
    metricsStore.load(projectId);
  }, [projectId]);

  if (loading || !metrics) {
    return (
      <div role="status" aria-busy="true" style={{ height: `var(--dashboard-height)`, padding: `var(--space-lg)`, display: 'flex', gap: `var(--space-lg)` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ flex: 1, background: 'var(--color-skeleton)', borderRadius: `var(--radius-xl)` }} />
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
    <div style={{ height: `var(--dashboard-height)`, padding: `var(--space-lg)`, display: 'flex', gap: `var(--space-lg)`, borderBottom: `1px solid var(--color-divider)` }}>
      {cards.map((card) => (
        <div key={card.label} style={{ flex: 1, background: 'var(--color-surface)', borderRadius: `var(--radius-xl)`, padding: `var(--space-lg)`, border: `1px solid var(--color-divider)` }}>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: `var(--space-sm)` }}>{card.label}</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>{card.value}</div>
        </div>
      ))}
      <div style={{
        width: '120px',
        background: metrics.audit_chain_healthy ? 'var(--color-healthy-bg)' : 'var(--color-broken-bg)',
        borderRadius: `var(--radius-xl)`,
        padding: `var(--space-lg)`,
        border: `1px solid ${metrics.audit_chain_healthy ? 'var(--color-healthy-border)' : 'var(--color-broken-border)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: 600,
        color: metrics.audit_chain_healthy ? 'var(--color-healthy-text)' : 'var(--color-broken-text)'
      }}>
        {metrics.audit_chain_healthy ? 'Chain Healthy' : 'Chain Broken'}
      </div>
    </div>
  );
}
