---
description: 'Playwright test generation instructions'
applyTo: '**'
---

## Test Writing Guidelines

### Code Quality Standards

- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions.

### Test Structure

- **Imports**: Start with `import { test, expect } from '@playwright/test';`.
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Hooks**: Use `beforeEach` for setup actions common to all tests in a `describe` block (e.g., navigating to a page).
- **Titles**: Follow a clear naming convention, such as `Feature - Specific action or scenario`.

### File Organization

- **Location**: Store all test files in the `tests/` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `login.spec.ts`, `search.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.

### Assertion Best Practices

- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.

## Example Test Structure

```typescript
import { test, expect } from '../../fixtures/base';
import { HomePage } from '../../pages/home/home.page';
import config from '../../../playwright.config';
import { submitForm } from '../../fixtures/dataFactory';

// const envPage = config.baseUrl;
const envPage = config.baseUrl;
test.describe('Home Layout', { tag: ['@smoke'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto(envPage);
  });

  // test('should display the correct title', async ({ homePage }) => {
  //   await homePage.checkH1();
  // });


  test('Check for console errors on the page', async ({ homePage, page }) => {
    // await homePage.takeQuerySnapshot("body", { componentId: "home" });
    const errors: Error[] = [];
    page.on('pageerror', (error) => {
      errors.push(error);
    });
    expect(errors).toHaveLength(0);

  });


  test.skip('quick login', async ({ page }) => {
    const STORAGE_STATE = "e2e/fixtures/auth.json"
    await page.goto("/");
    await page.getByRole("link", { name: "login" }).click();
    await page.getByPlaceholder("Enter username").fill(process.env.USERNAME!)
    await page.getByPlaceholder("Enter password").fill(process.env.PASSWORD!)
    await page.getByRole('button', { name: "login" }).click()

    await expect(page.getByRole('button', { name: "Personal" })).toBeVisible()
    await page.context().storageState({ path: STORAGE_STATE })
  })


  test.skip('Handling Visibility in Playwright: getByText vs. getByRole', async ({ page }) => {
    const STORAGE_STATE = "e2e/fixtures/auth.json"
    await page.goto("/");
    await expect(page.getByRole('button', { name: 'submit' })).toBeVisible();
    await expect(page.getByText('submit').filter({ visible: true })).toBeVisible()
  })
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:

- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented
