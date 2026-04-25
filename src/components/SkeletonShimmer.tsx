interface SkeletonShimmerProps {
  lines?: number;
  height?: number;
}

export function SkeletonShimmer({ lines = 3, height = 16 }: SkeletonShimmerProps) {
  return (
    <div role="status" aria-busy="true" aria-label="Loading" style={{ padding: '16px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: `${height}px`,
            background: '#e5e7eb',
            borderRadius: '4px',
            marginBottom: '8px',
            width: i === lines - 1 ? '60%' : '100%',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
