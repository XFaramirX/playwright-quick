import { test, expect, Locator } from '@playwright/test';
import { HomePage } from '../../pages/home/home.page';
import config from '../../../playwright.config';
import * as component from '../../fixtures/contentModel';

const envPage = config.baseUrl;

test.describe.skip('Visual Assertions', { tag: ['@visual'] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto(envPage);
  });

  test('Component Snapshots', async ({ page }) => {
    for (const [name, selector] of Object.entries(component)) {
      if (config.componentSnapshots) {
        if (name !== "nav" && name !== "utilityNav") {
          // Hide the nav bar for all other components , if needed include the cookie banner here as well.
          await page.evaluate(({ navSelector }) => {
            document.querySelector(navSelector)?.setAttribute("style", "display: none;");
          }, { navSelector: component.nav.container });
        } else {
          // Ensure nav and utilityNav are visible when capturing their screenshots
          await page.evaluate(({ navSelector }) => {
            document.querySelector(navSelector)?.setAttribute("style", "display: block;");
            document.querySelector("p.cmp-utility-nav__banner-section__banner")?.setAttribute("aria-hidden", "false");
          }, { navSelector: component.nav.container });
        }

        const element = await page.locator(selector.container).nth(0);
        await expect(element).toBeVisible();
        await homePage.takeQuerySnapshot(selector.container, name);
      }
    }
  });
});



