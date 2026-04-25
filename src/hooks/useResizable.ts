import { useState, useCallback, useEffect } from 'preact/hooks';

interface UseResizableOptions {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
}

export function useResizable({ initialWidth, minWidth, maxWidth }: UseResizableOptions) {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    function onMouseMove(e: MouseEvent) {
      setWidth(() => Math.max(minWidth, Math.min(maxWidth, e.clientX)));
    }
    function onMouseUp() {
      setIsDragging(false);
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, minWidth, maxWidth]);

  return { width, onMouseDown, isDragging };
}
