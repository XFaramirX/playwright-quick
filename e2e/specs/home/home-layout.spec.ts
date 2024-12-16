import { test, expect, Locator } from '@playwright/test';
import { HomePage } from '../../pages/home/home.page';
import config from '../../../playwright.config';

const envPage = config.baseUrl;
test.describe('Home Layout', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto(envPage);
  });

  test('should display the correct title', async () => {
    await homePage.checkH1();
  });

  test('screenshot component testing', async () => {
    await homePage.takeQuerySnapshot("body", { componentId: "home" });
  });

}); 
