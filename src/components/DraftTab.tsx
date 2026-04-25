import { useState } from 'preact/hooks';
import { ticketDetailStore } from '../stores/ticketDetailStore';
import { ErrorInline } from './ErrorInline';

export function DraftTab() {
  const ticket = ticketDetailStore.ticket.value;
  const mergeState = ticketDetailStore.mergeState.value;
  const error = ticketDetailStore.error.value;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  if (!ticket) return <p style={{ padding: '16px', color: '#6b7280' }}>No ticket selected.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280' }}>Original</h4>
              <pre style={{ background: '#f9fafb', padding: '12px', borderRadius: '4px', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                {ticket.draft_content}
              </pre>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280' }}>Your Edit</h4>
              <textarea
                value={editContent}
                onInput={(e) => setEditContent((e.target as HTMLTextAreaElement).value)}
                style={{ width: '100%', height: '300px', fontFamily: 'inherit', fontSize: '13px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
          </div>
        ) : (
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            {ticket.draft_content}
          </pre>
        )}

        {mergeState && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#92400e' }}>
              This draft was modified by another reviewer. Latest version: {mergeState.latestVersion}.
            </p>
            <button
              onClick={() => ticketDetailStore.resolveMerge(mergeState.latestVersion)}
              style={{ padding: '4px 12px', fontSize: '13px', border: '1px solid #f59e0b', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Accept Latest Version
            </button>
          </div>
        )}

        {error && <div style={{ marginTop: '16px' }}><ErrorInline message={error} onRetry={() => ticketDetailStore.selectTicket(ticket.ticket_id)} /></div>}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        {isEditing ? (
          <>
            <button
              onClick={() => { setIsEditing(false); setEditContent(''); }}
              style={{ padding: '6px 16px', fontSize: '13px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={() => { setIsEditing(false); /* save editContent */ }}
              style={{ padding: '6px 16px', fontSize: '13px', border: 'none', background: '#2563eb', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Save Edit
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => ticketDetailStore.approve()}
              style={{ padding: '6px 16px', fontSize: '13px', border: 'none', background: '#22c55e', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Approve (A)
            </button>
            <button
              onClick={() => ticketDetailStore.reject()}
              style={{ padding: '6px 16px', fontSize: '13px', border: 'none', background: '#ef4444', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reject (R)
            </button>
            <button
              onClick={() => { setEditContent(ticket.draft_content); setIsEditing(true); }}
              style={{ padding: '6px 16px', fontSize: '13px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Edit (E)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
