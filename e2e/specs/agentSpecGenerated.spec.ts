const { test, expect } = require('@playwright/test');
const path = require('path');

test('Fill out and submit the form on example.com', async ({ page }) => {
  // 1. Navigate to the form page
  await page.goto('https://example.com/form');

  // 2. Show: playwright live (assuming a select or input)
  await page.getByLabel('Show').fill('playwright live');

  // 3. Date: 15 July (assuming a date input or text field)
  await page.getByLabel('Date').fill('15 July');

  // 4. Time: 1:00 AM
  await page.getByLabel('Time').fill('1:00 AM');

  // 5. Topic: Playwright Live - Latest updates on Playwright MCP + Live Demo
  await page.getByLabel('Topic').fill('Playwright Live - Latest updates on Playwright MCP + Live Demo');

  // ...
  // Fill out other fields as needed, following the prompt instructions

  // 13. Upload image file './selfie.png'
  const filePath = path.resolve(__dirname, 'selfie.png');
  await page.setInputFiles('input[type="file"]', filePath);

  // Click the Submit button
  await page.getByRole('button', { name: /submit/i }).click();

  // Optionally, check for a success message or navigation
  await expect(page).toHaveURL(/.*success|thank/i);
});
