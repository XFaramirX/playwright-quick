import { test, expect } from '../../fixtures/base'
import config from '../../../playwright.config';
import * as component from '../../fixtures/contentModel';

const envPage = config.baseUrl;

test.describe.skip('Component Library', { tag: ['@component'] }, () => {
  test.beforeEach(async ({ page, homePage }) => {
    await homePage.goto(envPage);
  });

  test('Contact Us Loop tru example', async ({ page, homePage }) => {
    // Iterate through the elements and check visibility based on elements class.
    for (const [, selector] of Object.entries(component.contactUs)) {
      const element = page.locator(selector).nth(0);
      await expect(element).toBeVisible();
    }
    //Captures a “snapshot” of the entire state of a component
    await expect(page.locator('#cmp-contact')).toMatchAriaSnapshot(`
      - heading [level=2]
      - button
      - heading [level=3]
      - paragraph
      `);

    // Check functionality for Cta
    const button = await page.locator(component.contactUs.container).nth(0);
    await homePage.hoverAndClick(button);

  });

}); 
