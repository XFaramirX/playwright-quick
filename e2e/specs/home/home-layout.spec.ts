import { test, expect } from '../../fixtures/base';
import config from '../../../playwright.config';

const envPage = config.baseUrl;

test.describe('Home Layout', { tag: ['@smoke'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto(envPage);
  });

  test('Home - should not have console errors', async ({ homePage, page }) => {
    await test.step('Listen for page errors and verify none occur', async () => {
      const errors: Error[] = [];
      page.on('pageerror', (error) => {
        errors.push(error);
      });
      expect(errors).toHaveLength(0);
    });
  });


  test.skip('quick login', async ({ page }) => {
    const STORAGE_STATE = "e2e/fixtures/auth.json";
    await page.goto("/");
    await page.getByRole("link", { name: "login" }).click();
    await page.getByPlaceholder("Enter username").fill(process.env.USERNAME!);
    await page.getByPlaceholder("Enter password").fill(process.env.PASSWORD!);
    await page.getByRole('button', { name: "login" }).click();

    await expect(page.getByRole('button', { name: "Personal" })).toBeVisible();
    await page.context().storageState({ path: STORAGE_STATE });
  });


  test.skip('Handling Visibility in Playwright: getByText vs. getByRole', async ({ page }) => {
    const STORAGE_STATE = "e2e/fixtures/auth.json";
    await page.goto("/");
    await expect(page.getByRole('button', { name: 'submit' })).toBeVisible();
    await expect(page.getByText('submit').filter({ visible: true })).toBeVisible();
  });
});

