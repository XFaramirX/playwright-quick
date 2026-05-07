import { test, expect } from '@playwright/test';

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
  <span style="font-weight: 400; color: #94a3b8; letter-spacing: .03em;">QA&nbsp;Annotation&nbsp;Review</span>
</div>`;

test.describe('Login Page - Annotated QA Review', {
  tag: ['@smoke', '@qa-review'],
}, () => {
  test('record annotated QA walkthrough as a video receipt', async ({ page }) => {

    // ── Start recording ──────────────────────────────────────────────
    await page.screencast.start({ path: 'e2e/reports/screenshots/login-annotated-review.webm' });

    // Persistent REC badge
    await page.screencast.showOverlay(REC_OVERLAY);

    // Annotate every action with a callout
    await page.screencast.showActions({ position: 'top-right' });

    // ── Chapter 1: Navigation ────────────────────────────────────────
    await page.screencast.showChapter('Navigating to Login Page', {
      description: 'Open the login page and verify it loaded',
    });

    await test.step('Navigate to login page', async () => {
      await page.goto('https://practice.expandtesting.com/login');
      await expect(page).toHaveURL(/login/);
      await expect(page.getByRole('heading', { name: /test login page/i })).toHaveCount(1);
    });

    // ── Chapter 2: Issue Zone 1 ──────────────────────────────────────
    await page.screencast.showChapter('Issue Zone 1 — not render', {
      description: 'Zone at x:1003 y:209 — content may not render correctly',
    });

    await test.step('Inspect issue zone 1 (not render)', async () => {
      await expect(page.getByLabel('Username')).toHaveCount(1);
      await expect(page.getByLabel('Password')).toHaveCount(1);
      await expect(page.getByRole('button', { name: /login/i })).toHaveCount(1);
    });

    // ── Chapter 3: Issue Zone 2 ──────────────────────────────────────
    await page.screencast.showChapter('Issue Zone 2 — overlap?', {
      description: 'Zone at x:348 y:411 — possible element overlap on password field',
    });

    await test.step('Inspect issue zone 2 (overlap)', async () => {
      const passwordField = page.getByLabel('Password');
      await passwordField.scrollIntoViewIfNeeded();
      await passwordField.focus();
    });

    // ── Chapter 4: Done ──────────────────────────────────────────────
    await page.screencast.showChapter('Done', {
      description: 'QA annotation review completed ✓',
    });

    // ── Stop recording ────────────────────────────────────────────────
    await page.screencast.stop();
  });
});
