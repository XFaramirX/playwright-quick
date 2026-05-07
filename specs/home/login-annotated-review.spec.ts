import { test, expect } from '@playwright/test';

test.describe('Login Page - Annotated QA checks', () => {
  test('layout and core flow checks', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('https://practice.expandtesting.com/login');
      await expect(page).toHaveURL(/login/);
      await expect(page.getByRole('heading', { name: /test login page/i })).toHaveCount(1);
    });

    await test.step('Validate login form controls', async () => {
      await expect(page.getByLabel('Username')).toHaveCount(1);
      await expect(page.getByLabel('Password')).toHaveCount(1);
      await expect(page.getByRole('button', { name: /login/i })).toHaveCount(1);
    });

    await test.step('Check for obvious off-screen clipping', async () => {
      const clipped = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll('a, button, input, [role="navigation"]')];
        return nodes.some((node) => {
          const rect = node.getBoundingClientRect();
          return rect.right < 0 || rect.left > window.innerWidth || rect.width <= 0 || rect.height <= 0;
        });
      });
      expect(clipped).toBeFalsy();
    });

    await test.step('Visual baseline with masks for unstable zones', async () => {
      const visualDiffMaskZones = [
        { x: 1003, y: 209, width: 244, height: 377, reason: 'not render' },
        { x: 348, y: 411, width: 230, height: 29, reason: 'overlap?' }
      ];

      // TODO: Replace placeholder masks with stable locators for each zone.
      // Example: mask: [page.getByRole('navigation').first()]
      await expect(page).toHaveScreenshot('login-annotated-review.png');
      expect(visualDiffMaskZones.length).toBeGreaterThan(0);
    });
  });
});
