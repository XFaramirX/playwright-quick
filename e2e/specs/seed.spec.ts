import { test, expect } from '../fixtures/base';

test.describe('Test group', { tag: '@quick' }, () => {
  test('seed', async ({ page }) => {
    await page.goto("https://codemify.com");
  });
});

