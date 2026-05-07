import { test, expect } from '../fixtures/base';
import * as path from 'path';
const SESSION_NAME = 'my-session';
test.describe('Test group', { tag: '@quick' }, () => {
    test('seed', async ({ browser, page }, testInfo) => {
        // ── 1. Do whatever navigation your test needs ────────────────────────────────
        await page.goto('https://playwright.dev');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.getByRole('heading', { name: 'Key capabilities' })
        // ── 2. Bind the test's browser — this is the SAME Chrome the test is using ──
        //       workspaceDir tells playwright-cli where the project root is.
        const { endpoint } = await browser.bind(SESSION_NAME, {
            workspaceDir: path.resolve(process.cwd()),
        });
    });
});

