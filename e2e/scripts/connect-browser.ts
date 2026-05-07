/**
 * STEP 2 — "Client" side: Connect to the browser that bind-browser.ts is running.
 *
 * Run AFTER bind-browser.ts is already running:
 *   npx ts-node e2e/scripts/connect-browser.ts <wsEndpoint>
 *
 * The wsEndpoint is printed by bind-browser.ts, e.g.:
 *   ws://localhost:54321/...
 *
 * What it does:
 *   1. Connects to the already-running browser via chromium.connect()
 *   2. Lists all open pages
 *   3. Takes a screenshot of the first page
 *   4. Opens a NEW page alongside the existing ones
 *   5. Disconnects — the original browser keeps running!
 *
 * Key insight: the client DOES NOT own the browser lifecycle.
 *   - browser.close() on the client only closes the connection, not the process.
 *   - Multiple clients can connect simultaneously.
 */

import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs   from 'fs';

(async () => {
  // ── Get the ws:// endpoint from the command line ────────────────────────────
  const wsEndpoint = process.argv[2];

  if (!wsEndpoint) {
    console.error('Usage: npx ts-node connect-browser.ts <wsEndpoint>');
    console.error('Example: npx ts-node connect-browser.ts ws://localhost:54321/...');
    console.error('\nStart bind-browser.ts first – it prints the endpoint.');
    process.exit(1);
  }

  console.log('\nConnecting to:', wsEndpoint);

  // ── 1. Connect — multiple clients supported simultaneously ─────────────────
  const browser = await chromium.connect(wsEndpoint);
  console.log('Connected! Browser version:', browser.version());

  // ── 2. See what pages the other client already has open ────────────────────
  const contexts = browser.contexts();
  console.log(`\nFound ${contexts.length} browser context(s)`);

  for (const [ci, ctx] of contexts.entries()) {
    const pages = ctx.pages();
    console.log(`  Context ${ci}: ${pages.length} page(s)`);
    for (const [pi, page] of pages.entries()) {
      console.log(`    Page ${pi}: ${page.url()}`);
    }
  }

  // ── 3. Screenshot the first open page ──────────────────────────────────────
  const firstPage = contexts[0]?.pages()[0];
  if (firstPage) {
    const screenshotPath = path.resolve(
      process.cwd(),
      'e2e/reports/screenshots/connected-page.png'
    );
    // Ensure the directory exists
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    await firstPage.screenshot({ path: screenshotPath });
    console.log('\nScreenshot saved to:', screenshotPath);
  }

  // ── 4. Open a new page in the shared browser ────────────────────────────────
  //       This page is VISIBLE to anyone watching the browser window.
  const newPage = await contexts[0].newPage();
  await newPage.goto('https://github.com/microsoft/playwright');
  console.log('\nOpened new page → https://github.com/microsoft/playwright');
  console.log('(Visible in the other client\'s browser window!)');

  await newPage.waitForTimeout(3_000);

  // ── 5. Disconnect — original browser keeps running ─────────────────────────
  await browser.close(); // closes the CLIENT connection, NOT the browser
  console.log('\nDisconnected. The browser launched by bind-browser.ts is still running.');
})();
