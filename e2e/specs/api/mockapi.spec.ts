import { test, expect } from '@playwright/test';

test('mock google page + mock api response', async ({ page }) => {

  // 1️⃣ Mock the API response
  await page.route('**/api/search**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: ['playwright tutorial', 'playwright automation']
      }),
    });
  });

  // 2️⃣ Mock the document (HTML)
  await page.route('https://www.google.com/', async route => {
    if (route.request().resourceType() === 'document') {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `
<!doctype html>
<html>
  <body>
    <h1>Mocked Google</h1>
    <input aria-label="Search" id="search"/>
    <ul id="results"></ul>

    <script>
      const input = document.getElementById('search');
      const resultsList = document.getElementById('results');

      input.addEventListener('input', async (e) => {
        const res = await fetch('/api/search?q=' + e.target.value);
        const data = await res.json();

        resultsList.innerHTML = '';
        data.results.forEach(r => {
          const li = document.createElement('li');
          li.textContent = r;
          resultsList.appendChild(li);
        });
      });
    </script>
  </body>
</html>
        `,
      });
      return;
    }
    await route.continue();
  });

  // 3️⃣ Navigate
  await page.goto('https://www.google.com/');

  // 4️⃣ Type in the mock search input
  await page.locator('[aria-label="Search"]').fill('playwright');

  // 5️⃣ Assert mocked API results appear
  await expect(page.locator('text=playwright tutorial')).toBeVisible();
});
