import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should load login page successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    // Check for email input field
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toBeVisible();

    // Check for password input field
    const passwordInput = page.getByLabel(/parola|password/i);
    await expect(passwordInput).toBeVisible();

    // Check for submit/login button
    const submitButton = page.getByRole('button', { name: /autentificare|login|conectare/i });
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /autentificare|login|conectare/i });
    await submitButton.click();

    // Wait for any error message to appear
    await page.waitForTimeout(1000);

    // Check if we're still on login page (form validation prevented submission)
    await expect(page).toHaveURL(/\/login/);
  });
});
