import { test } from '@playwright/test';

test.describe('W3Schools Form', () => {
  test('fill out and submit the form', async ({ page }) => {
    await page.goto('https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit', { waitUntil: "domcontentloaded" });

    // Switch to the iframe containing the form
    const frame = await page.frame({ name: 'iframeResult' });
    if (!frame) throw new Error('iframeResult not found');

    // Fill the form fields
    await frame.fill('input[name="fname"]', 'Alice');
    await frame.fill('input[name="lname"]', 'Smith');

    // Submit the form
    await frame.click('input[type="submit"]');
  });
});
