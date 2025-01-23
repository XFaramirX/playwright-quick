import { test, expect } from '../../fixtures/base';
import { HomePage } from '../../pages/home/home.page';
import config from '../../../playwright.config';

const envPage = config.baseUrl;
test.describe('Home Layout', { tag: ['@smoke'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto(envPage);
  });

  test('should display the correct title', async ({ homePage }) => {
    await homePage.checkH1();
  });

  test('screenshot component testing 2', async ({ homePage }) => {
    // await homePage.takeQuerySnapshot("body", { componentId: "home" });
    await homePage.checkH1();
  });

  test('screenshot component testing 3 ', async ({ homePage }) => {
    // await homePage.takeQuerySnapshot("body", { componentId: "home" });
    await homePage.checkH1();
  });

  test('screenshot component testing  4', async ({ homePage }) => {
    // await homePage.takeQuerySnapshot("body", { componentId: "home" });
    await homePage.checkH1();
  });

}); 
