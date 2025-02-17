// import { test, expect, Locator } from '@playwright/test';
// import { HomePage } from '../../pages/home/home.page';
// import config from '../../../playwright.config';
// import * as component from '../../fixtures/contentModel';

// const envPage = config.baseUrl;

// test.describe('Component Library', () => {
//   let homePage: HomePage;

//   test.beforeEach(async ({ page }) => {
//     homePage = new HomePage(page);
//     await homePage.goto(envPage);
//   });

//   test('Contact Us', async ({ page }) => {
//     // Iterate through the elements and check visibility based on elements class.
//     for (const [, selector] of Object.entries(component.contactUs)) {
//       const element = page.locator(selector).nth(0);
//       await expect(element).toBeVisible();
//     }
//     //Captures a “snapshot” of the entire state of a component
//     await expect(page.locator('#cmp-contact')).toMatchAriaSnapshot(`
//       - heading [level=2]
//       - button
//       - heading [level=3]
//       - paragraph
//       `);

//     // Check functionality for Cta
//     const button = await page.locator(component.contactUs.cta).nth(0);
//     await homePage.hoverAndClick(button);

//   });
//   test('50/50', async ({ page }) => {
//     for (const [, selector] of Object.entries(component.fifty50)) {
//       const element = await page.locator(selector).nth(0);
//       await element.scrollIntoViewIfNeeded();
//       await expect(element).toBeVisible();
//     }

//     await expect(page.locator('#cmp-fifty-fifty')).toMatchAriaSnapshot(`
//       - img
//       - paragraph
//       - heading [level=3]
//       - paragraph
//       - button
//       `);

//     const button = await page.locator(component.fifty50.cta).nth(0);
//     await homePage.hoverAndClick(button);

//   });
//   test('Tile Grid', async ({ page }) => {
//     for (const [, selector] of Object.entries(component.tileGrid)) {
//       const element = await page.locator(selector).nth(0);
//       await element.scrollIntoViewIfNeeded();
//       await expect(element).toBeVisible();
//     }

//     await expect(page.locator(component.tileGrid.container)).toMatchAriaSnapshot(`
//       - heading [level=3]
//       - button
//       - list:
//         - listitem:
//           - link:
//             - heading [level=4]
//       `);

//     const button = await page.locator(component.tileGrid.cta).nth(0);
//     await homePage.hoverAndClick(button);
//   });

//   test('Accordion', async ({ page }) => {
//     for (const [, selector] of Object.entries(component.accordion)) {
//       const element = await page.locator(selector).nth(0);
//       await expect(element).toBeVisible();
//     }

//     await expect(page.locator(component.accordion.container)).toMatchAriaSnapshot(`
//       - heading [level=3] :
//         - button
//       `);

//     const button = await page.locator(component.accordion.cta).nth(0);
//     await homePage.hoverAndClick(button);


//   });

//   test('Tabs', async ({ page }) => {
//     for (const [, selector] of Object.entries(component.tabs)) {
//       const element = await page.locator(selector).nth(0);
//       await element.scrollIntoViewIfNeeded();
//       await expect(element).toBeVisible();
//     }

//     await expect(page.locator(component.tabs.container).nth(0)).toMatchAriaSnapshot(`
//       - tablist:
//         - tab [selected]
//         - tab 
//       `);


//   });

//   test('Promo Teaser', async ({ page }) => {
//     for (const [, selector] of Object.entries(component.promoTeaser)) {
//       const element = await page.locator(selector).nth(0);
//       await element.scrollIntoViewIfNeeded();
//       await expect(element).toBeVisible();
//     }

//     await expect(page.locator(component.promoTeaser.container)).toMatchAriaSnapshot(`
//       - paragraph
//       - heading [level=3]
//       - paragraph
//       - button
//       `);

//     const button = await page.locator(component.promoTeaser.cta).nth(0);
//     await homePage.hoverAndClick(button);
//   });


//   test('Footer', async ({ page }) => {
//     for (const [, selector] of Object.entries(component.footer)) {
//       const element = await page.locator(selector).nth(0);
//       await expect(element).toBeVisible();
//     }
//     await expect(page.locator(component.footer.container)).toMatchAriaSnapshot(``);
//     const button = await page.locator(component.footer.cta).nth(0);
//     await homePage.hoverAndClick(button);

//   });

//   test.skip('Visual', async ({ page }) => {
//     for (const [name, selector] of Object.entries(component)) {
//       const element = await page.locator(selector.container).nth(0);
//       await expect(element).toBeVisible();
//       if (config.componentSnapshots) {
//         await homePage.takeQuerySnapshot(selector.container, name);
//       }
//     }
//   });

// }); 
