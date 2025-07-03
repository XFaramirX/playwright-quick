import { test, expect } from '@playwright/test';

test('open google', async ({ page }) => {
  // Navigate to Google
  await page.goto('https://www.google.com');
  const test = await page.getByTitle("Google").describe("TituloGoogle")
  await expect(test).toHaveText("Google")
  // Verify we're on Google's homepage
  await expect(page).toHaveTitle(/Google/);
}); 