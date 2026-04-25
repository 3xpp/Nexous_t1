import { ticketStore } from '../stores/ticketStore';

export function ModeToggle() {
  const mode = ticketStore.mode.value;

  return (
    <div role="group" aria-label="View mode" style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '2px', borderRadius: '4px' }}>
      <button
        type="button"
        aria-pressed={mode === 'reviewer'}
        onClick={() => ticketStore.setMode('reviewer')}
        style={{
          padding: '4px 12px',
          border: 'none',
          borderRadius: '3px',
          fontSize: '13px',
          cursor: 'pointer',
          background: mode === 'reviewer' ? '#fff' : 'transparent',
          fontWeight: mode === 'reviewer' ? 600 : 400,
          boxShadow: mode === 'reviewer' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
        }}
      >
        Reviewer
      </button>
      <button
        type="button"
        aria-pressed={mode === 'lead'}
        onClick={() => ticketStore.setMode('lead')}
        style={{
          padding: '4px 12px',
          border: 'none',
          borderRadius: '3px',
          fontSize: '13px',
          cursor: 'pointer',
          background: mode === 'lead' ? '#fff' : 'transparent',
          fontWeight: mode === 'lead' ? 600 : 400,
          boxShadow: mode === 'lead' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
        }}
      >
        Lead
      </button>
    </div>
  );
}
