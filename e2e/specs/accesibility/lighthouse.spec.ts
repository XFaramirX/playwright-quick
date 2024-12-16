import { test } from '@playwright/test';
import { BasePage } from '../../pages/base.page';
import config from '../../../playwright.config';
import playwright from 'playwright';

const siteUrls = config.baseUrl;

test.describe("Lighthouse Audit", { tag: ['@lighthouse'] }, () => {
  let basePage: BasePage;
  let browser: any;
  test.beforeEach(async () => {
    browser = await playwright['chromium'].launch({
      args: ['--remote-debugging-port=9222'],
    });
    const page = await browser.newPage();
    basePage = new BasePage(page);
    await page.goto(siteUrls);

  });

  test.afterEach(async () => {
    await browser.close();
  });

  test('lighthouse audit', async ({ }, testInfo) => {
    test.skip(!config.lighthouseAudit, 'Lighthouse audit is disabled');
    const lighthouseAudit = await basePage.checkLighthouse();
    await testInfo.attach('Lighthouse audit results', {
      body: JSON.stringify(lighthouseAudit, null, 2),
      contentType: 'application/json'
    });
  });
});
