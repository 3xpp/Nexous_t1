import { useEffect, useState } from 'preact/hooks';
import { ticketStore } from '../stores/ticketStore';
import { auditStore } from '../stores/auditStore';
import type { AuditEntry } from '../types';
import { SkeletonShimmer } from './SkeletonShimmer';
import { ErrorInline } from './ErrorInline';

export function AuditTab() {
  const ticketId = ticketStore.selectedId.value;
  const entries = auditStore.entries.value;
  const loading = auditStore.loading.value;
  const error = auditStore.error.value;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (ticketId) {
      auditStore.loadChain(ticketId);
    }
  }, [ticketId]);

  if (loading && (!entries || entries.length === 0)) return <SkeletonShimmer lines={4} />;
  if (error) return <ErrorInline message={error} onRetry={() => ticketId && auditStore.loadChain(ticketId)} />;

  return (
    <div style={{ padding: '16px' }}>
      {(entries || []).map((entry: AuditEntry) => (
        <div
          key={entry.entry_id}
          onClick={() => setExpandedId(expandedId === entry.entry_id ? null : entry.entry_id)}
          style={{
            padding: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            marginBottom: '8px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
            <span style={{ fontWeight: 600 }}>{entry.action}</span>
            <span style={{ color: '#6b7280' }}>{entry.actor}</span>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>{entry.timestamp}</span>
            <code style={{ fontSize: '11px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>
              {entry.entry_hash.slice(0, 16)}
            </code>
          </div>
          {expandedId === entry.entry_id && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#374151' }}>
              <p style={{ margin: '4px 0' }}><strong>Entry hash:</strong> {entry.entry_hash}</p>
              <p style={{ margin: '4px 0' }}><strong>Prev hash:</strong> {entry.prev_hash}</p>
              <p style={{ margin: '4px 0' }}><strong>Payload hash:</strong> {entry.payload_hash}</p>
              <p style={{ margin: '4px 0' }}><strong>Model:</strong> {entry.model}@{entry.model_version}</p>
              <p style={{ margin: '4px 0' }}><strong>Run ID:</strong> {entry.run_id}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
