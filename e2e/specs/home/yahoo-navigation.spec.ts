import { test } from '@playwright/test';

test.describe('Yahoo Navigation', () => {
    test('navigate to Yahoo homepage', async ({ page }) => {
        await page.goto('https://www.yahoo.com');
    });
});