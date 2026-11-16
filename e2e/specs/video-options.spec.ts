import { test, expect } from '@playwright/test';

const VIDEO_SIZE = { width: 1920, height: 1080 };

test.use({
  viewport: VIDEO_SIZE,
  trace: 'off',
  video: {
    mode: 'on',
    size: VIDEO_SIZE,
    fps: 60,
    show: {
      actions: {
        style: {
          point: 'width: 20px; height: 20px; border-radius: 50%; background: red',
          highlight: 'outline: 2px solid #333; background: rgba(0, 128, 255, .15)',
          title: 'font-size: 16px',
        },
      },
    },
  },
});

test.describe('Video - Fixture recording', { tag: ['@screencast'] }, () => {
  test('records styled actions with the video fixture', async ({ page }) => {
    await page.setContent(`
      <main>
        <h1>Subscription</h1>
        <label for="email">Email</label>
        <input id="email" type="email">
        <button onclick="document.querySelector('[role=status]').textContent = 'Subscribed'">Subscribe</button>
        <p role="status"></p>
      </main>
    `);

    await test.step('Enter an email and subscribe', async () => {
      await page.getByLabel('Email').fill('alex@example.test');
      await expect(page.getByLabel('Email')).toHaveValue('alex@example.test');
      await page.getByRole('button', { name: 'Subscribe' }).click();
      await expect(page.getByRole('status')).toHaveText('Subscribed');
    });
  });
});