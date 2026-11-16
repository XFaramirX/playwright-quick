import { test, expect } from '@playwright/test';
import { stat } from 'node:fs/promises';

const VIDEO_SIZE = { width: 1920, height: 1080 };
const VIDEO_FPS = 60;
const FLOW_URL = 'https://receipt.example.test/';
const FLOW_HTML = `<!doctype html>
<html lang="en">
  <head><title>Video receipt demo</title></head>
  <body>
    <main>
      <h1>Request a demo</h1>
      <form>
        <label for="name">Name</label>
        <input id="name" name="name" required>
        <button type="submit">Send request</button>
      </form>
      <p role="status" aria-live="polite"></p>
    </main>
    <script>
      document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        document.querySelector('[role="status"]').textContent =
          'Request received for ' + document.querySelector('#name').value;
      });
    </script>
  </body>
</html>`;

test.use({ video: 'off', trace: 'off', viewport: VIDEO_SIZE });

test.describe('Screencast - Annotated user flow', { tag: ['@screencast'] }, () => {
  test('records an annotated receipt and captures live frames', async ({ page }, testInfo) => {
    const videoPath = testInfo.outputPath('annotated-receipt.webm');
    let firstFrame: Buffer | undefined;
    let frameCount = 0;

    await page.route(FLOW_URL, route => route.fulfill({ contentType: 'text/html', body: FLOW_HTML }));
    await page.goto(FLOW_URL);
    await page.screencast.start({
      path: videoPath,
      size: VIDEO_SIZE,
      fps: VIDEO_FPS,
      onFrame: ({ data }) => {
        frameCount += 1;
        firstFrame ??= data;
      },
    });

    try {
      await page.screencast.showActions({
        position: 'top-right',
        style: {
          point: 'width: 20px; height: 20px; border-radius: 50%; background: red',
          highlight: 'outline: 2px solid #333; background: rgba(0, 128, 255, .15)',
          title: 'font-size: 16px',
        },
      });
      await page.screencast.showOverlay('<div style="padding: 8px; background: #222; color: white">Recording user flow</div>');

      await test.step('Enter the request details', async () => {
        await page.screencast.showChapter('Request a demo', { description: 'Enter the customer name' });
        await page.getByLabel('Name').fill('Alex');
        await expect(page.getByLabel('Name')).toHaveValue('Alex');
      });

      await test.step('Submit and verify the receipt', async () => {
        await page.screencast.showChapter('Submit request', { description: 'Confirm the request was received' });
        await page.getByRole('button', { name: 'Send request' }).click();
        await expect(page.getByRole('status')).toHaveText('Request received for Alex');
        await expect.poll(() => frameCount).toBeGreaterThan(0);
      });
    } finally {
      await page.screencast.stop();
      await testInfo.attach('annotated-video-receipt', { path: videoPath, contentType: 'video/webm' });
    }

    expect((await stat(videoPath)).size).toBeGreaterThan(0);
    expect(firstFrame?.subarray(0, 2).toString('hex')).toBe('ffd8');
    await testInfo.attach('first-live-frame', { body: firstFrame!, contentType: 'image/jpeg' });
  });
});