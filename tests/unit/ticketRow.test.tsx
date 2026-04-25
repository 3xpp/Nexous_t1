import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { TicketRow } from '../../src/components/TicketRow';
import type { TicketSummary } from '../../src/types';

const mockTicket: TicketSummary = {
  ticket_id: 'TC-001',
  requirement_id: 'REQ-042',
  requirement_summary: 'The brake light shall illuminate when pedal is depressed',
  asil: 'B',
  model_name: 'llama',
  model_version: '3.1',
  generation_score: 0.91,
  status: 'draft',
  reviewer_id: null,
  created_at: '2026-04-25T10:00:00Z',
  updated_at: '2026-04-25T10:00:00Z',
  draft_version: 2
};

describe('TicketRow', () => {
  it('renders ticket info in comfortable density', () => {
    render(<TicketRow ticket={mockTicket} isSelected={false} onSelect={vi.fn()} density="comfortable" />);
    expect(screen.getByText('TC-001')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText(/brake light/)).toBeTruthy();
  });

  it('renders compact without summary preview', () => {
    render(<TicketRow ticket={mockTicket} isSelected={false} onSelect={vi.fn()} density="compact" />);
    expect(screen.getByText('TC-001')).toBeTruthy();
    expect(screen.queryByText(/brake light/)).toBeNull();
  });

  it('calls onSelect on click', () => {
    const onSelect = vi.fn();
    render(<TicketRow ticket={mockTicket} isSelected={false} onSelect={onSelect} density="comfortable" />);
    fireEvent.click(screen.getByText('TC-001'));
    expect(onSelect).toHaveBeenCalledWith('TC-001');
  });
});
