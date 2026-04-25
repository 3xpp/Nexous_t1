import { test, expect } from '@playwright/test';
import { allTickets } from '../fixtures';

async function mockApiRoutes(page) {
  await page.route('**/api/tickets/metrics?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_drafts: allTickets.filter(t => t.status === 'draft').length,
        pending_approval: allTickets.filter(t => t.status === 'pending').length,
        approved_today: allTickets.filter(t => t.status === 'approved').length,
        rejected_today: allTickets.filter(t => t.status === 'rejected').length,
        avg_review_time_minutes: 18,
        queue_oldest_minutes: 120,
        audit_chain_healthy: true
      })
    });
  });

  await page.route('**/api/tickets/stream?**', async (route) => {
    const deltas = allTickets.map(t => ({
      action: 'create',
      ticket_id: t.ticket_id,
      payload: {
        ticket_id: t.ticket_id,
        requirement_id: t.requirement_id,
        requirement_summary: t.requirement_summary,
        asil: t.asil,
        model_name: t.model_name,
        model_version: t.model_version,
        generation_score: t.generation_score,
        status: t.status,
        reviewer_id: t.reviewer_id,
        created_at: t.created_at,
        updated_at: t.updated_at,
        draft_version: t.draft_version
      }
    }));
    const body = deltas.map(d => `event: ticket_delta\ndata: ${JSON.stringify(d)}\n\n`).join('');
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: { 'cache-control': 'no-cache' },
      body
    });
  });
}

test.describe('Master Ticket View', () => {
  test('switches between Reviewer and Lead mode', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');
    await expect(page.getByText('Select a ticket from the queue')).toBeVisible();

    await page.getByRole('button', { name: 'Lead' }).click();
    await expect(page.getByText('Total Drafts')).toBeVisible();

    await page.getByRole('button', { name: 'Reviewer' }).click();
    await expect(page.getByText('Select a ticket from the queue')).toBeVisible();
  });

  test('keyboard shortcut M toggles mode', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');
    await expect(page.getByText('Select a ticket from the queue')).toBeVisible();

    await page.keyboard.press('m');
    await expect(page.getByText('Total Drafts')).toBeVisible();

    await page.keyboard.press('m');
    await expect(page.getByText('Select a ticket from the queue')).toBeVisible();
  });

  test('loads real ticket queue from fixtures', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');
    const firstTicket = allTickets[0];
    await expect(page.getByText(firstTicket.ticket_id)).toBeVisible();
    await expect(page.getByText(firstTicket.requirement_summary.substring(0, 20)).first()).toBeVisible();
  });
});
