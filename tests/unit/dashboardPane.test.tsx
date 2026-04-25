import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/preact';
import { DashboardPane } from '../../src/components/DashboardPane';
import * as api from '../../src/api';

vi.mock('../../src/api', () => ({
  fetchMetrics: vi.fn()
}));

describe('DashboardPane', () => {
  it('renders skeleton state when metrics are loading', () => {
    vi.mocked(api.fetchMetrics).mockImplementation(() => new Promise(() => {}));
    render(<DashboardPane projectId="proj-1" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders metrics when data is loaded', async () => {
    const metrics = {
      total_drafts: 42,
      pending_approval: 12,
      approved_today: 5,
      rejected_today: 1,
      avg_review_time_minutes: 18,
      queue_oldest_minutes: 120,
      audit_chain_healthy: true
    };
    vi.mocked(api.fetchMetrics).mockResolvedValue(metrics);
    render(<DashboardPane projectId="proj-1" />);
    await waitFor(() => {
      expect(screen.getByText('Total Drafts')).toBeTruthy();
      expect(screen.getByText('42')).toBeTruthy();
      expect(screen.getByText('Pending')).toBeTruthy();
      expect(screen.getByText('12')).toBeTruthy();
    });
  });

  it('shows audit chain unhealthy warning', async () => {
    const metrics = {
      total_drafts: 10,
      pending_approval: 2,
      approved_today: 0,
      rejected_today: 0,
      avg_review_time_minutes: 5,
      queue_oldest_minutes: 30,
      audit_chain_healthy: false
    };
    vi.mocked(api.fetchMetrics).mockResolvedValue(metrics);
    render(<DashboardPane projectId="proj-1" />);
    await waitFor(() => {
      expect(screen.getByText(/Chain Broken/i)).toBeTruthy();
    });
  });
});
