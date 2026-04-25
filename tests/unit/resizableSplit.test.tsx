import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { ResizableSplit } from '../../src/components/ResizableSplit';

describe('ResizableSplit', () => {
  it('renders left and right children', () => {
    render(
      <ResizableSplit initialLeftWidth={300} minLeftWidth={200} maxLeftWidth={500}>
        <div data-testid="left">Left</div>
        <div data-testid="right">Right</div>
      </ResizableSplit>
    );
    expect(screen.getByTestId('left')).toBeTruthy();
    expect(screen.getByTestId('right')).toBeTruthy();
  });

  it('updates width on drag', () => {
    render(
      <ResizableSplit initialLeftWidth={300} minLeftWidth={200} maxLeftWidth={500}>
        <div data-testid="left">Left</div>
        <div data-testid="right">Right</div>
      </ResizableSplit>
    );
    const handle = screen.getByRole('separator');
    fireEvent.mouseDown(handle, { clientX: 300 });
    fireEvent.mouseMove(window, { clientX: 400 });
    fireEvent.mouseUp(window);
    const leftPane = screen.getByTestId('left').parentElement;
    expect(leftPane?.style.width).toBe('400px');
  });
});
