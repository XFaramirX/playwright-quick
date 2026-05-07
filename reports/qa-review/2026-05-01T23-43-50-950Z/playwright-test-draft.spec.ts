import { test, expect } from '@playwright/test';

type IssueZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  reason: string;
};

async function renderVideoAnnotations(page: any, zones: IssueZone[]) {
  await page.evaluate((items) => {
    const existing = document.getElementById('qa-video-annotation-layer');
    if (existing) {
      existing.remove();
    }

    const layer = document.createElement('div');
    layer.id = 'qa-video-annotation-layer';
    layer.style.position = 'fixed';
    layer.style.inset = '0';
    layer.style.pointerEvents = 'none';
    layer.style.zIndex = '2147483646';

    items.forEach((zone, idx) => {
      const box = document.createElement('div');
      box.setAttribute('data-qa-video-annotation', 'box');
      box.style.position = 'fixed';
      box.style.left = Math.max(0, zone.x) + 'px';
      box.style.top = Math.max(0, zone.y) + 'px';
      box.style.width = Math.max(4, zone.width) + 'px';
      box.style.height = Math.max(4, zone.height) + 'px';
      box.style.border = '3px solid #e11d48';
      box.style.background = 'rgba(225, 29, 72, 0.12)';
      box.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.7) inset';

      const label = document.createElement('div');
      label.textContent = 'Issue ' + (idx + 1) + ': ' + zone.reason;
      label.style.position = 'absolute';
      label.style.left = '0';
      label.style.top = '-26px';
      label.style.padding = '2px 8px';
      label.style.borderRadius = '4px';
      label.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      label.style.fontSize = '12px';
      label.style.color = '#fff';
      label.style.background = '#be123c';
      label.style.whiteSpace = 'nowrap';

      box.appendChild(label);
      layer.appendChild(box);
    });

    const legend = document.createElement('div');
    legend.setAttribute('data-qa-video-annotation', 'legend');
    legend.style.position = 'fixed';
    legend.style.right = '12px';
    legend.style.bottom = '12px';
    legend.style.maxWidth = '360px';
    legend.style.padding = '8px 10px';
    legend.style.borderRadius = '8px';
    legend.style.background = 'rgba(15, 23, 42, 0.86)';
    legend.style.color = '#e2e8f0';
    legend.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    legend.style.fontSize = '12px';
    legend.style.lineHeight = '1.45';
    legend.textContent = 'QA Video Annotations: ' + items.length + ' issue zone(s)';
    layer.appendChild(legend);

    document.body.appendChild(layer);
  }, zones);
}

async function clearVideoAnnotations(page: any) {
  await page.evaluate(() => {
    document.getElementById('qa-video-annotation-layer')?.remove();
  });
}

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
      { x: 348, y: 411, width: 230, height: 29, reason: 'overlap?' },
      ];

      await renderVideoAnnotations(page, visualDiffMaskZones);
      await expect(page.locator('[data-qa-video-annotation="box"]')).toHaveCount(visualDiffMaskZones.length);
      await page.mouse.move(visualDiffMaskZones[0].x + 8, visualDiffMaskZones[0].y + 8);

      // TODO: Replace placeholder masks with stable locators for each zone.
      // Example: mask: [page.getByRole('navigation').first()]
      await expect(page).toHaveScreenshot('login-annotated-review.png');
      expect(visualDiffMaskZones.length).toBeGreaterThan(0);

      await clearVideoAnnotations(page);
    });
  });
});

