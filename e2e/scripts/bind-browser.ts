/**
 * STEP 1 — "Server" side: Launch a browser and bind it so other clients can connect.
 *
 * Run this script first:
 *   npx ts-node e2e/scripts/bind-browser.ts
 *
 * What it does:
 *   1. Launches a visible Chromium browser
 *   2. Calls browser.bind('my-session') to expose it under the name "my-session"
 *   3. Navigates to a page so you can see what's happening
 *   4. Prints the endpoint that other clients can use to connect
 *   5. Waits 60 s then calls browser.unbind() to stop accepting new connections
 */

import { chromium } from '@playwright/test';
import * as path from 'path';

(async () => {
  // ── 1. Launch a real, visible browser ───────────────────────────────────────
  const browser = await chromium.launch({
    headless: false, // visible so you can watch what agents do
  });

  const page  = await browser.newPage();
  await page.goto('https://playwright.dev');
  console.log('Browser opened → https://playwright.dev');

  // ── 2a. Named-pipe binding (simplest form) ───────────────────────────────────
  //        "my-session" is an arbitrary name that other CLI commands reference.
  //        workspaceDir is the root that playwright-cli uses for file operations.
  const { endpoint: namedPipeEndpoint } = await browser.bind('my-session', {
    workspaceDir: path.resolve(process.cwd()),
  });

  console.log('\n──────────────────────────────────────────────────');
  console.log('Browser bound!  Session name: my-session');
  console.log('Named-pipe endpoint:', namedPipeEndpoint);
  console.log('\nConnect with playwright-cli:');
  console.log('  playwright-cli attach my-session');
  console.log('  playwright-cli -s my-session snapshot');
  console.log('\nConnect from @playwright/mcp:');
  console.log('  @playwright/mcp --endpoint=my-session');
  console.log('──────────────────────────────────────────────────\n');

  // ── 2b. WebSocket binding (alternative) ─────────────────────────────────────
  //        Pass host + port to get a ws:// URL instead of a named pipe.
  //        port: 0  →  OS picks a free port automatically.
  const { endpoint: wsEndpoint } = await browser.bind('my-session-ws', {
    host: 'localhost',
    port: 0, // let the OS pick a free port
    workspaceDir: path.resolve(process.cwd()),
  });

  console.log('WebSocket endpoint (for chromium.connect):');
  console.log(' ', wsEndpoint);
  console.log('\nOther Playwright clients can now do:');
  console.log(`  const browser = await chromium.connect('${wsEndpoint}')`);
  console.log('──────────────────────────────────────────────────\n');

  // ── 3. Keep the browser alive for 60 s so you can experiment ────────────────
  console.log('Waiting 60 s … open connect-browser.ts in another terminal.');
  await page.waitForTimeout(60_000);

  // ── 4. Unbind — stop accepting new connections (existing ones remain) ────────
  await browser.unbind(); // one call covers all bound sessions
  console.log('\nbrowser.unbind() called – no new connections accepted.');

  await browser.close();
  console.log('Done.');
})();
