import { test } from '@playwright/test';
import { BasePage } from '../../pages/base.page';
import config from '../../../playwright.config';
import playwright from 'playwright';

const siteUrls = {
  homePage: config.baseUrl + "/content/carrier/us/en/Huge/HomePage.html",
  pdpPage: config.baseUrl + "/content/carrier/us/en/Huge/PdpPage.html"
};

const debugPort = "--remote-debugging-port=9222";

test.describe("Lighthouse Audit", { tag: ['@lighthouse'] }, () => {
  let browser: any;

  test.beforeAll(async () => {
    browser = await playwright['chromium'].launch({
      args: [debugPort],
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });

  for (const [pageName, url] of Object.entries(siteUrls)) {
    test(`Generate Lighthouse audit report for ${pageName}`, async ({ }, testInfo) => {
      if (!config.lighthouseAudit) {
        console.log(`Skipping Lighthouse audit for ${pageName} as it is disabled in config.`);
        return;
      }

      const page = await browser.newPage();
      await page.goto(url);
      const basePage = new BasePage(page);
      const lighthouseAudit = await basePage.checkLighthouse();
      await testInfo.attach(`Lighthouse audit results for ${pageName}`, {
        body: JSON.stringify(lighthouseAudit, null, 2),
        contentType: 'application/json'
      });
      await page.close();
    });
  }
});
