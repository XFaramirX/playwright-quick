import { chromium, test, expect } from '@playwright/test';

const TOOL_URL = 'https://webmcp.example.test/';
const TOOL_PAGE = `<!doctype html>
<html lang="en">
  <head><title>WebMCP tool demo</title></head>
  <body>
    <h1>Calculator tool</h1>
    <p role="status">Registering tool</p>
    <script>
      (async () => {
        const modelContext = document.modelContext || navigator.modelContext;
        await modelContext.registerTool({
          name: 'add',
          description: 'Add two numbers',
          inputSchema: {
            type: 'object',
            properties: { a: { type: 'number' }, b: { type: 'number' } },
            required: ['a', 'b']
          },
          execute: async ({ a, b }) => ({ content: [{ type: 'text', text: String(a + b) }] })
        });
        document.querySelector('[role="status"]').textContent = 'Tool ready';
      })();
    </script>
  </body>
</html>`;

test.describe('WebMCP - Page tools', { tag: ['@webmcp'] }, () => {
  test('discovers and invokes a registered tool', async ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'This example launches Chromium with WebMCP enabled.');
    const browser = await chromium.launch({ args: ['--enable-features=WebMCP'] });
    try {
      const page = await browser.newPage();
      await page.route(TOOL_URL, route => route.fulfill({ contentType: 'text/html', body: TOOL_PAGE }));
      await page.goto(TOOL_URL);
      await expect(page.getByRole('status')).toHaveText('Tool ready');

      await test.step('Discover the page tool and its schema', async () => {
        const tools = await page.webmcp.tools();
        expect(tools).toEqual(expect.arrayContaining([
          expect.objectContaining({ name: 'add', description: 'Add two numbers' }),
        ]));
        expect(tools.find(tool => tool.name === 'add')?.inputSchema).toMatchObject({
          type: 'object', required: ['a', 'b'],
        });
      });

      await test.step('Call the tool and verify its result', async () => {
        const result = await page.webmcp.callTool('add', { a: 2, b: 40 });
        expect(result).toEqual({ content: [{ type: 'text', text: '42' }] });
      });
    } finally {
      await browser.close();
    }
  });
});