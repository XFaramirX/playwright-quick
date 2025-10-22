# EXAMPLES OF PROMPTS
https://github.com/debs-obrien/playwright-mcp-prompts/tree/main/.github 

# End to End suite

This is a general overview of what is inside the End to end suite.

## Before you start

For the purpose of this guide here are some clarifications:

- The "end-to-end" is the `./e2e` directory
- The "root directory" is the directory that contains the "end-to-end directory"
## Install dependencies

From the root directory, run the following command:

```bash
npm run install
```

## Start the local server only when working locally.

```bash
npm run start
```

> **Note:** This command start the local server but do not turn off the local sever so open a new command line if necessary to run the test.

## Run all the tests

Tu run all the end to end tests, run the following command from the root directory:

```bash
npm run test
```

## Run only the smoke or "tag" suite

Tu run only a suite of tagged test , run the following command from the root directory:

```bash
npm run test:smoke
```

> **Note:** The tests tagged with `@smoke` will be executed.

## Run only the failed test

Tu run only a last run failed tests only , run the following command from the root directory:

```bash
npm run test:failed
```

## End to end UI

To lunch the Playwrigth GUI, run the following command from the root directory:

```bash
npx playwright test -ui
```

## Run end to end tests on another environment

To run the end to end tests on dev,stage or prod, run de the following command from the root directory:

```bash
TEST_ENV=dev npm run test
TEST_ENV=stage npm run test
TEST_ENV=prod npm run test
```

## Run Playwrigth code generation tool

To run the Playwrigth code generation tool, run the the following command from the root directory:

```bash
npx playwright e2e-codegen
```


## Accessibility Testing

To run the A11y accessibility testing report, use the `checkA11y()` method from the `BasePage` class:

```bash
checkA11y()
```

## Simulate CI/CD Test Runs

To simulate the test on CI/CD:

```bash
npx playwright test -g "@smoke" --repeat-each=100 --workers=10 -x
```

## Chrome DevTools MCP for Lighthouse-like Audits

Lighthouse tests are no longer supported directly in this project. Instead, use the [mcp chrome-devtools](https://www.npmjs.com/package/chrome-devtools-mcp) server for automated site audits and reporting.

### How to use chrome-devtools MCP

1. Ensure the `chrome-devtools` MCP server is configured in `.vscode/mcp.json`:

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

3. Use the MCP API or CLI to run audits and generate reports for your site. Refer to the [chrome-devtools-mcp documentation](https://www.npmjs.com/package/chrome-devtools-mcp) for usage details.

This replaces the previous Lighthouse integration for site performance and accessibility reporting.
