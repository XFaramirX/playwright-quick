import { test } from '@playwright/test';
import { BasePage } from '../../pages/base.page';

test.describe('Google Screenshot', () => {
    test('take screenshot of Google homepage', async ({ page }) => {
        await page.goto('https://www.google.com');
        await page.screenshot({ path: 'e2e/reports/snapshots/home/google-homepage.png', fullPage: true });
    });
});