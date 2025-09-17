import { test } from "../../fixtures/api.fixture";
import { expect } from "@playwright/test";
test("Create new user and log in via UI", async ({ newUser, page }) => {
  const { email, password } = newUser;

  await test.step("Visit login page and log in", async () => {
    await page.goto("https://chirpy.bieda.it/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('#submit-json');
    await expect(page).toHaveURL("https://chirpy.bieda.it/home");
  });
});
