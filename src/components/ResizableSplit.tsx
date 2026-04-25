import type { ComponentChildren } from 'preact';
import { useResizable } from '../hooks/useResizable';

interface ResizableSplitProps {
  initialLeftWidth: number;
  minLeftWidth: number;
  maxLeftWidth: number;
  children: [ComponentChildren, ComponentChildren];
}

export function ResizableSplit({ initialLeftWidth, minLeftWidth, maxLeftWidth, children }: ResizableSplitProps) {
  const { width, onMouseDown, isDragging } = useResizable({
    initialWidth: initialLeftWidth,
    minWidth: minLeftWidth,
    maxWidth: maxLeftWidth
  });

  const [left, right] = children;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: `${width}px`, minWidth: `${minLeftWidth}px`, maxWidth: `${maxLeftWidth}px`, overflow: 'auto' }}>
        {left}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        onMouseDown={onMouseDown}
        style={{
          width: '4px',
          cursor: 'col-resize',
          background: isDragging ? '#2563eb' : '#e5e7eb',
          flexShrink: 0
        }}
      />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {right}
      </div>
    </div>
  );
}
