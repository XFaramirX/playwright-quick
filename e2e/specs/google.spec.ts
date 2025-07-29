import { expect } from '@playwright/test';
import { HomePage } from '../pages/home/home.page';
import { monitorAPI as test } from "../fixtures/api.fixture";
test('open google', async ({ page }) => {
  // Navigate to Google
  await page.goto('https://www.google.com');
  const test = await page.getByTitle("Google").describe("TituloGoogle")
  // await expect(test).toHaveText("Google")
  // Verify we're on Google's homepage
  await expect(page).toHaveTitle(/Google/);
});

test('monitor google', async ({ pageWithMonitoring }) => {
  const homePage = new HomePage(pageWithMonitoring);
  await pageWithMonitoring.goto('https://danube-web.shop');
  // await expect(pageWithMonitoring).toHaveTitle(/Google/);
});