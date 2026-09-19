import { test, expect } from '@playwright/test';

test.describe('VantageEstates', () => {
  test('home page loads and shows Vantage Estates content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Vantage Estates' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse Accounts' })).toBeVisible();
  });

  test('not found route shows 404', async ({ page }) => {
    await page.goto('/non-existent-route');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('Page not found')).toBeVisible();
  });
});
