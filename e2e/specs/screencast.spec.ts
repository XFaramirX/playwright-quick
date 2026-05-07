import { test, expect } from '../fixtures/base';

/** Glassmorphism "● REC" badge injected as a persistent overlay.
 *  Uses a <style> block for the CSS pulse animation since keyframes
 *  cannot be expressed in inline styles alone. */
const REC_OVERLAY = `
<style>
  @keyframes pw-rec-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px 1px #ef4444; }
    50%       { opacity: .45; box-shadow: 0 0 14px 3px #ef4444; }
  }
</style>
<div style="
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(10, 10, 20, 0.78);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 7px 16px 7px 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .07em;
  color: #f1f5f9;
  box-shadow: 0 8px 32px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06);
  user-select: none;
">
  <span style="
    width: 9px; height: 9px; border-radius: 50%;
    background: #ef4444; flex-shrink: 0;
    animation: pw-rec-pulse 1.5s ease-in-out infinite;
    display: inline-block;
  "></span>
  <span style="color: #ef4444; letter-spacing: .12em;">REC</span>
  <span style="width:1px;height:14px;background:rgba(255,255,255,.14);border-radius:2px;"></span>
  <span style="font-weight: 400; color: #94a3b8; letter-spacing: .03em;">Playwright&nbsp;1.59</span>
</div>`;

test.describe('Screencast - DuckDuckGo Search receipt', {
    tag: ['@smoke', '@screencast'],
}, () => {

    test('record a DuckDuckGo search walkthrough as a video receipt', async ({ page }) => {

        // ── Start recording ──────────────────────────────────────────────
        await page.screencast.start({ path: 'e2e/reports/screenshots/ddg-search-receipt.webm' });

        // Persistent glassmorphism REC badge — stays until screencast.stop()
        await page.screencast.showOverlay(REC_OVERLAY);

        // Annotate every click / fill / keyboard action with a callout
        await page.screencast.showActions({ position: 'top-right' });

        // ── Chapter 1: Navigation ─────────────────────────────────────────
        await page.screencast.showChapter('Navigating to DuckDuckGo', {
            description: 'Open the DuckDuckGo HTML endpoint and verify it loaded',
        });

        await test.step('Navigate to DuckDuckGo HTML', async () => {
            // html.duckduckgo.com/html/ is the plain-HTML version:
            // no JavaScript required, no bot-detection, always returns results
            await page.goto('https://html.duckduckgo.com/html/');
            await expect(page).toHaveURL(/duckduckgo\.com/);
            await expect(page).toHaveTitle(/DuckDuckGo/);
        });

        // ── Chapter 2: Search ─────────────────────────────────────────────
        await page.screencast.showChapter('Performing a search', {
            description: 'Type a query into the search box and submit',
        });

        await test.step('Enter search query', async () => {
            // Plain-HTML page has a single <input name="q"> — no strict-mode issues
            const searchBox = page.locator('input[name="q"]');
            await searchBox.fill('Playwright 1.59 screencast API');
            await searchBox.press('Enter');
        });

        // ── Chapter 3: Verify results ─────────────────────────────────────
        await page.screencast.showChapter('Verifying search results', {
            description: 'Confirm results page loaded with relevant results',
        });

        await test.step('Assert results page', async () => {
            await expect(page).toHaveURL(/duckduckgo\.com/);
            // HTML results use <a class="result__a"> links — server-rendered, no JS needed
            await expect(page.locator('a.result__a').first()).toBeVisible();
        });

        // ── Chapter 4: Done ───────────────────────────────────────────────
        await page.screencast.showChapter('Done', {
            description: 'Search completed — results confirmed ✓',
        });

        // ── Stop recording ─────────────────────────────────────────────────
        await page.screencast.stop();
    });
});