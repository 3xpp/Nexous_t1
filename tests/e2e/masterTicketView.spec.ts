import { test, expect } from '@playwright/test';

async function mockApiRoutes(page) {
  await page.route('**/api/tickets/metrics?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_drafts: 42,
        pending_approval: 12,
        approved_today: 5,
        rejected_today: 1,
        avg_review_time_minutes: 18,
        queue_oldest_minutes: 120,
        audit_chain_healthy: true
      })
    });
  });

  await page.route('**/api/tickets/stream?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: { 'cache-control': 'no-cache' },
      body: 'data: {"action":"init","tickets":[]}\n\n'
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
});
