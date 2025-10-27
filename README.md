
# Playwright End-to-End Suite

This repository contains end-to-end tests using Playwright. Below are instructions for setup, running tests, and useful commands.

---

## Directory Structure

- **End-to-end tests:** `./e2e`
- **Root directory:** The folder containing the `e2e` directory

---

## Setup & Installation

Install dependencies from the root directory:

```bash
npm install
```

---

## Local Development

Start the local server (for local testing):

```bash
npm run start
```

> **Note:** The server runs in the foreground. Open a new terminal to run tests while the server is running.

---

## Running Tests

Run all end-to-end tests:

```bash
npm run test
```

Run only the smoke/tagged suite:

```bash
npm run test:smoke
```

> **Note:** Only tests tagged with `@smoke` will be executed.

Run only failed tests from the last run:

```bash
npm run test:failed
```

Launch Playwright UI:

```bash
npx playwright test -ui
```

Run tests on a specific environment (dev, stage, prod):

```bash
TEST_ENV=dev npm run test
TEST_ENV=stage npm run test
TEST_ENV=prod npm run test
```

Run Playwright code generation tool:

```bash
npx playwright e2e-codegen
```

---

## Accessibility Testing

Use the `checkA11y()` method from the `BasePage` class for accessibility reports:

```js
checkA11y()
```

---

## Simulate CI/CD Test Runs

Run smoke tests in CI/CD simulation:

```bash
npx playwright test -g "@smoke" --repeat-each=100 --workers=10 -x
```

---

## Chrome DevTools MCP for Site Audits

Lighthouse tests are no longer supported directly. Use [chrome-devtools-mcp](https://www.npmjs.com/package/chrome-devtools-mcp) for automated audits and reporting.

### Setup chrome-devtools MCP

1. Configure `.vscode/mcp.json`:

	```jsonc
	"chrome-devtools": {
	  "command": "npx",
	  "args": ["-y", "chrome-devtools-mcp@latest"]
	}
	```

2. Start the MCP server:

	```bash
	npx chrome-devtools-mcp
	```

3. Use the MCP API/CLI to run audits and generate reports. See [chrome-devtools-mcp documentation](https://www.npmjs.com/package/chrome-devtools-mcp) for details.

---

## Run in Docker

To run Playwright tests in Docker, mount your local project folder as a volume and set the working directory:

```bash
docker run -it --rm --ipc=host -v "g:/DataXFaramir/Huge/playwrightFramework:/work" -w /work mcr.microsoft.com/playwright:v1.56.1-noble /bin/bash
```

Once inside the container, run:

```bash
npx playwright test
```