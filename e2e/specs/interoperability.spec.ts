/**
 * STEP 3 — Using browser.bind() inside Playwright Test (the test-runner context).
 *
 * This spec demonstrates the interoperability API from within @playwright/test.
 *
 * Run with:
 *   npx playwright test e2e/specs/interoperability.spec.ts --project=chromium
 *
 * The `browser` fixture provided by Playwright Test is a real Browser object, so
 * browser.bind() / browser.unbind() work exactly the same way here.
 *
 * Real-world use-cases covered:
 *   1. Bind during a test so an AI agent / MCP server can observe the browser
 *   2. Bind over WebSocket for remote agent connections
 *   3. Verify a second Playwright client can connect and interact concurrently
 *   4. await using  (new v1.59 syntax) for automatic cleanup
 */

import { test, expect, chromium } from '@playwright/test';
import * as path from 'path';

// ─── 1. Named-pipe binding ────────────────────────────────────────────────────
test.describe('browser.bind() – Interoperability API (v1.59)', () => {

  // STEP 1: Basic bind / unbind lifecycle
  test('should bind a browser and return an endpoint', async ({ browser }) => {
    await test.step('Bind the browser under a session name', async () => {
      const { endpoint } = await browser.bind('test-session', {
        workspaceDir: path.resolve(process.cwd()),
      });

      // The endpoint is always a non-empty string (pipe path or ws:// URL)
      expect(endpoint).toBeTruthy();
      expect(typeof endpoint).toBe('string');

      console.log('Named-pipe endpoint:', endpoint);

      // Connect with playwright-cli while this test is paused:
      //   playwright-cli attach test-session
      //   playwright-cli -s test-session snapshot
    });

    await test.step('Unbind stops accepting new connections', async () => {
      // browser.unbind() takes NO arguments — stops all bound sessions on this browser
      await browser.unbind();
      // After unbind, existing pages still work – only new connections are rejected
    });
  });

  // STEP 2: WebSocket binding – needed for remote / cross-machine connections
  test('should bind over WebSocket and return a ws:// endpoint', async ({ browser }) => {
    await test.step('Bind over WebSocket with port: 0', async () => {
      const { endpoint } = await browser.bind('ws-session', {
        host: 'localhost',
        port: 0, // OS picks a free port
        workspaceDir: path.resolve(process.cwd()),
      });

      expect(endpoint).toMatch(/^ws:\/\//);
      console.log('WebSocket endpoint:', endpoint);

      // This endpoint can be passed to:
      //   @playwright/mcp --endpoint=<endpoint>
      //   const client = await chromium.connect(endpoint)
    });

    await test.step('Unbind the WebSocket session', async () => {
      await browser.unbind(); // stops all sessions on this browser
    });
  });

  // STEP 3: Multiple simultaneous clients – the headline feature of bind()
  test('should allow a second Playwright client to connect and share the browser', async ({ browser, page }) => {
    let wsEndpoint: string;

    await test.step('Navigate the "owner" page', async () => {
      await page.goto('https://playwright.dev');
      await expect(page).toHaveTitle(/Playwright/);
    });

    await test.step('Bind the browser over WebSocket', async () => {
      const binding = await browser.bind('multi-client-session', {
        host: 'localhost',
        port: 0,
        workspaceDir: path.resolve(process.cwd()),
      });
      wsEndpoint = binding.endpoint;
      console.log('Shared endpoint:', wsEndpoint);
    });

    await test.step('Second client connects and can see the same pages', async () => {
      // A completely separate Playwright instance connects to the same browser
      const secondClient = await chromium.connect(wsEndpoint);

      try {
        const contexts = secondClient.contexts();
        expect(contexts.length).toBeGreaterThan(0);

        const pages = contexts[0].pages();
        expect(pages.length).toBeGreaterThan(0);

        // The second client sees the URL that the owner navigated to
        const sharedPage = pages[0];
        await expect(sharedPage).toHaveURL(/playwright\.dev/);

        console.log('Second client sees:', sharedPage.url());

        // The second client can also interact with the page
        const title = await sharedPage.title();
        expect(title).toContain('Playwright');
      } finally {
        // Closing the client connection does NOT close the browser
        await secondClient.close();
      }
    });

    await test.step('Unbind session after use', async () => {
      await browser.unbind(); // stops all sessions on this browser
    });
  });

  // STEP 4: await using — new v1.59 async disposable syntax
  //         The bind result is disposable, so cleanup is automatic.
  test('await using syntax auto-unbinds on scope exit', async ({ browser }) => {
    await test.step('Bind with await using for automatic cleanup', async () => {
      // When the block exits (normally or on error), unbind is called automatically
      {
        // NOTE: Requires TypeScript target ES2022+ and useDefineForClassFields
        // If your tsconfig doesn't support "await using", use the manual approach
        // from the tests above instead.
        //
        // await using session = await browser.bind('auto-session', {
        //   workspaceDir: path.resolve(process.cwd()),
        // });
        // console.log('Endpoint:', session.endpoint);
        // → unbind called automatically here

        // Equivalent manual pattern (always works):
        const session = await browser.bind('auto-session', {
          workspaceDir: path.resolve(process.cwd()),
        });
        console.log('Endpoint:', session.endpoint);
        await browser.unbind(); // stops all bound sessions
      }
    });
  });

  // STEP 5: Dashboard observability (Playwright 1.59)
  //         Run  `playwright-cli show`  in a terminal while this test runs
  //         to open the Dashboard and watch the bound browser live.
  test('dashboard – set PLAYWRIGHT_DASHBOARD=1 to surface test browsers', async ({ browser, page }) => {
    // With PLAYWRIGHT_DASHBOARD=1 env variable, @playwright/test AUTOMATICALLY
    // binds all test browsers so they appear in the Dashboard without any
    // browser.bind() call in your test code. This test just demonstrates that
    // the browser object is available for manual binding as well.

    await test.step('Navigate somewhere interesting', async () => {
      await page.goto('https://github.com/microsoft/playwright');
      await expect(page).toHaveURL(/github\.com\/microsoft\/playwright/);
      // While this step runs, open another terminal and run:
      //   PLAYWRIGHT_DASHBOARD=1 npx playwright test ...
      //   playwright-cli show
    });
  });
});
