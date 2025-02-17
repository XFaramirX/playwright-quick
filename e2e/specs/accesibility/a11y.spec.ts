import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home/home.page';
import config from '../../../playwright.config';

// const envPage = config.baseUrl;
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

  test(`The docs have no 404s`, async ({ page }, testInfo) => {
    const linkUrls = await homePage.getAllLinksFromPage(page);

    for (const url of linkUrls) {
      await test.step(`Checking link: ${url}`, async () => {
        try {
          // Note that some hosters / firewalls will block plain requests (Cloudflare, etc.)
          // if that's the case for you, consider using `page.goto`
          // or excluding particular URLs from the test
          const response = await page.request.get(url);

          expect
            .soft(response.ok(), `${url} has no green status code`)
            .toBeTruthy();
        } catch {
          expect.soft(null, `${url} has no green status code`).toBeTruthy();
        }
      });
    }

    testInfo.attach("checked-links.txt", {
      body: Array.from(linkUrls).join("\n"),
    });
  });

});
