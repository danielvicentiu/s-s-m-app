import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('should display page title', async ({ page }) => {
    await page.goto('/');

    // Check if title or main heading exists
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('should have CTA button', async ({ page }) => {
    await page.goto('/');

    // Look for common CTA button patterns
    const ctaButton = page.getByRole('link', { name: /încearcă|start|demo|autentificare|login/i }).first();
    await expect(ctaButton).toBeVisible();
  });
});
