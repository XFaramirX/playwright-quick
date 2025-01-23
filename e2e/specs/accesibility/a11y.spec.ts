import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home/home.page';
import config from '../../../playwright.config';

const envPage = config.baseUrl;

test.describe("A11y", { tag: ['@a11y'] }, async () => {
  let homePage: HomePage;
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto(envPage);
  });

  test('Accessibility Testing', async ({ }, testInfo) => {
    const accessibilityScanResults = await homePage.checkA11y();
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });
    // Uncomment the below line to fail the test if there are any violations
    // expect(accessibilityScanResults.violations).toEqual([]);
  });

});
