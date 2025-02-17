import { test, expect } from '../../fixtures/base';
import { HomePage } from '../../pages/home/home.page';
import config from '../../../playwright.config';
import { log } from 'console';
import { submitForm } from '../../fixtures/dataFactory';

// const envPage = config.baseUrl;
const envPage = config.baseUrl;
test.describe('Home Layout', { tag: ['@smoke'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto(envPage);
  });

  // test('should display the correct title', async ({ homePage }) => {
  //   await homePage.checkH1();
  // });

  // test('screenshot component testing 2', async ({ homePage }) => {
  //   // await homePage.takeQuerySnapshot("body", { componentId: "home" });
  //   await homePage.checkH1();
  // });

  // test('screenshot component testing 3 ', async ({ homePage }) => {
  //   // await homePage.takeQuerySnapshot("body", { componentId: "home" });
  //   await homePage.checkH1();
  // });

  // test('screenshot component testing  4', async ({ homePage }) => {
  //   // await homePage.takeQuerySnapshot("body", { componentId: "home" });
  //   await homePage.checkH1();
  // });

  test('Check for console errors on the page', async ({ homePage, page }) => {
    // await homePage.takeQuerySnapshot("body", { componentId: "home" });
    const errors: Error[] = [];
    page.on('pageerror', (error) => {
      errors.push(error);
    });
    expect(errors).toHaveLength(0);

  });

  // test('test API', async ({ page }) => {
  //   await submitForm("Jose", "Bernal");
  // })
});

