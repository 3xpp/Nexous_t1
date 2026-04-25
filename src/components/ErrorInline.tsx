interface ErrorInlineProps {
  message: string;
  onRetry: () => void;
}

export function ErrorInline({ message, onRetry }: ErrorInlineProps) {
  return (
    <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#991b1b' }}>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        style={{
          padding: '4px 12px',
          fontSize: '13px',
          border: '1px solid #ef4444',
          background: '#fff',
          color: '#991b1b',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );
}
