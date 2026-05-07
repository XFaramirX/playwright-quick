# Complete Test Examples

Read this file when you need detailed, working examples of different test types.

## Table of Contents
- [Login Test (E2E)](#login-test-e2e)
- [API Test with Validation](#api-test-with-validation)
- [Accessibility Test](#accessibility-test)
- [Visual Regression Test](#visual-regression-test)
- [Console Error Detection](#console-error-detection)

---

## Login Test (E2E)

```typescript
import { test, expect } from '../../fixtures/base';
import config from '../../../playwright.config';

test.describe('Authentication', { tag: ['@smoke'] }, () => {
    test('Login - Valid user can authenticate', async ({ page, loginPage }) => {
        await test.step('Navigate to login page', async () => {
            await loginPage.goto(`${config.baseUrl}/login`);
        });

        await test.step('Enter credentials and submit', async () => {
            await page.getByPlaceholder("Enter username").fill("testuser");
            await page.getByPlaceholder("Enter password").fill("password123");
            await page.getByRole('button', { name: "login" }).click();
        });

        await test.step('Verify successful login', async () => {
            await expect(page.getByRole('button', { name: "Profile" })).toBeVisible();
            await expect(page).toHaveURL(/dashboard/);
        });
    });
});
```

---

## API Test with Validation

```typescript
import { test, expect } from '../../fixtures/api.fixture';
import { submitForm } from '../../fixtures/dataFactory';

test.describe('API - User Service', { tag: ['@api'] }, () => {
    test('API - Create user and validate response', async ({ apiClient }) => {
        await test.step('Authenticate API client', async () => {
            await apiClient.authenticate({
                username: process.env.USERNAME!,
                password: process.env.PASSWORD!
            });
        });

        const userData = submitForm();

        await test.step('Create new user', async () => {
            const response = await apiClient.createNewUser(userData);
            
            expect(response.status).toBe(201);
            expect(response.data.email).toBe(userData.email);
            expect(response.data.id).toBeDefined();
        });

        await test.step('Retrieve created user', async () => {
            const retrieved = await apiClient.getUser(response.data.id);
            expect(retrieved.data).toEqual(response.data);
        });
    });
});
```

---

## Accessibility Test

```typescript
import { test, expect } from '../../fixtures/base';
import config from '../../../playwright.config';

test.describe('Accessibility', { tag: ['@a11y'] }, () => {
    test('A11y - Homepage WCAG compliance', async ({ homePage }, testInfo) => {
        await test.step('Navigate to homepage', async () => {
            await homePage.goto(config.baseUrl);
        });

        await test.step('Run accessibility scan', async () => {
            const violations = await homePage.checkA11y();
            
            await testInfo.attach('accessibility-scan-results', {
                body: JSON.stringify(violations, null, 2),
                contentType: 'application/json'
            });

            // Focus on critical violations, filter known third-party issues
            const criticalViolations = violations.filter((v: any) => 
                v.impact === 'critical' && v.id !== 'known-third-party-issue'
            );

            expect(criticalViolations, 'No critical accessibility violations').toHaveLength(0);
        });
    });
});
```

---

## Visual Regression Test

```typescript
import { test } from '../../fixtures/base';
import config from '../../../playwright.config';

test.describe('Visual Regression', () => {
    test('Visual - Homepage layout matches baseline', async ({ homePage }) => {
        await test.step('Navigate and capture full snapshot', async () => {
            await homePage.goto(config.baseUrl);
            await homePage.takeQuerySnapshot("body", "homepage-full");
        });

        await test.step('Capture component snapshot', async () => {
            await homePage.takeQuerySnapshot(".navigation", "nav-component");
        });
    });
});
```

---

## Console Error Detection

```typescript
import { test, expect } from '../../fixtures/base';
import config from '../../../playwright.config';

test.describe('Console Monitoring', () => {
    test('should not have console errors', async ({ page, homePage }) => {
        const errors: Error[] = [];
        
        page.on('pageerror', (error) => {
            errors.push(error);
        });

        await homePage.goto(config.baseUrl);
        
        // Perform various actions
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('link', { name: 'About' }).click();
        
        expect(errors, 'No JavaScript errors on page').toHaveLength(0);
    });
});
```

---

## Standard Page Object Example

```typescript
// pages/login/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { LoginSelectors } from './selectors';

export class LoginPage extends BasePage {
    private selectors = LoginSelectors;

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string): Promise<void> {
        await this.page.getByPlaceholder("Enter username").fill(username);
        await this.page.getByPlaceholder("Enter password").fill(password);
        await this.page.getByRole('button', { name: "login" }).click();
        
        // Verify login succeeded
        await expect(this.page.getByRole('button', { name: "Profile" })).toBeVisible();
    }

    async loginWithInvalidCredentials(username: string, password: string): Promise<void> {
        await this.page.getByPlaceholder("Enter username").fill(username);
        await this.page.getByPlaceholder("Enter password").fill(password);
        await this.page.getByRole('button', { name: "login" }).click();
    }

    async getErrorMessage(): Promise<string> {
        return await this.getTrimmedText(this.selectors.errorMessage);
    }
}
```

---

## Standard Selectors File

```typescript
// pages/login/selectors.ts
export const LoginSelectors = {
    usernameInput: 'input[placeholder="Enter username"]',
    passwordInput: 'input[placeholder="Enter password"]',
    loginButton: 'button[name="login"]',
    errorMessage: '.error-message',
    forgotPasswordLink: 'a[href="/forgot-password"]'
};
```
