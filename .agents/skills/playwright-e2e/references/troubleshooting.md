# Troubleshooting Guide

Read this when encountering common issues or errors in test execution.

## Table of Contents
- [Tests Fail in CI but Pass Locally](#tests-fail-in-ci-but-pass-locally)
- [Flaky Tests Due to Timing](#flaky-tests-due-to-timing)
- [Cannot Find Locator](#cannot-find-locator)
- [Schema Validation Fails](#schema-validation-fails)
- [Screenshot Comparison Fails](#screenshot-comparison-fails)
- [Timeout Errors](#timeout-errors)
- [Strict Mode Violations](#strict-mode-violations)

---

## Tests Fail in CI but Pass Locally

**Common Causes:**
- Environment variables missing or different
- Browser versions inconsistent
- Network conditions differ
- File paths are OS-specific
- Timing differences (CI often slower)

**Solutions:**
1. Check CI environment variables match local `.env`
2. Pin browser versions in `playwright.config.ts`
3. Use `process.env.CI` conditional logic if needed
4. Use cross-platform paths (`path.join()`)
5. Never use hard waits - use assertions instead

**Example Fix:**
```typescript
// ❌ Assumes specific OS
const filePath = 'C:\\Users\\data.csv';

// ✅ Cross-platform
import path from 'path';
const filePath = path.join(process.cwd(), 'data', 'data.csv');
```

---

## Flaky Tests Due to Timing

**Primary Cause:** Using hard waits or not waiting for proper state.

**Solution:** **NEVER use `waitForTimeout()`** - Use these patterns instead:

```typescript
// ✅ Pattern 1: Auto-retrying assertion (BEST)
await page.click('button');
await expect(page.locator('.result')).toBeVisible();

// ✅ Pattern 2: Wait for network idle
await page.click('button');
await page.waitForLoadState('networkidle');

// ✅ Pattern 3: Wait for specific request
const responsePromise = page.waitForResponse('**/api/data');
await page.click('button');
await responsePromise;

// ✅ Pattern 4: Wait for element state change
await page.click('button');
await page.locator('.spinner').waitFor({ state: 'detached' });
await expect(page.locator('.result')).toBeVisible();
```

**Remember:** Playwright automatically waits for actionability - clicks, fills, and assertions all have built-in waiting.

---

## Cannot Find Locator

**Common Causes:**
- Element doesn't exist in DOM
- Element not visible yet
- Selector is incorrect
- Strict mode violation (multiple matches)

**Debugging Steps:**

1. **Use Playwright Inspector:**
   ```bash
   PWDEBUG=1 npx playwright test
   ```

2. **Prefer accessible locators:**
   ```typescript
   // ✅ Good - role-based
   await page.getByRole('button', { name: 'Submit' })
   
   // ✅ Good - label-based
   await page.getByLabel('Email address')
   
   // ❌ Brittle - CSS class
   await page.locator('.btn-primary')
   ```

3. **Check for visibility issues:**
   ```typescript
   // Wait for element to be visible
   await page.locator('button').waitFor({ state: 'visible' });
   ```

4. **Check for strict mode violations:**
   ```typescript
   // ❌ Matches multiple elements
   await page.locator('button').click();
   
   // ✅ Be more specific
   await page.locator('button[aria-label="Submit"]').click();
   ```

---

## Schema Validation Fails

**Common Causes:**
- API response structure changed
- Nullable fields not marked optional
- Type mismatches (string vs number)
- Extra fields in response

**Solutions:**

1. **Print the actual response:**
   ```typescript
   const response = await apiClient.getData();
   console.log('Actual response:', JSON.stringify(response, null, 2));
   ```

2. **Update Zod schema:**
   ```typescript
   // ❌ Too strict
   const Schema = z.object({
       id: z.number(),
       name: z.string()
   });
   
   // ✅ Handle optional/nullable fields
   const Schema = z.object({
       id: z.number(),
       name: z.string(),
       email: z.string().nullable().optional(),
       metadata: z.record(z.any()).optional()
   }).passthrough(); // Allow extra fields
   ```

3. **Use safe parsing:**
   ```typescript
   const result = Schema.safeParse(response.data);
   if (!result.success) {
       console.error('Validation errors:', result.error.format());
   }
   ```

---

## Screenshot Comparison Fails

**Common Causes:**
- Font rendering differences across OS
- Animation mid-frame
- Dynamic content (dates, timestamps)
- Viewport size mismatch

**Solutions:**

1. **Update baseline if intentional:**
   ```bash
   npx playwright test --update-snapshots
   ```

2. **Adjust diff threshold:**
   ```typescript
   const screenshotOptions = {
       maxDiffPixelRatio: 0.15 // Allow 15% difference
   };
   ```

3. **Mask dynamic elements:**
   ```typescript
   await expect(page).toHaveScreenshot('page.png', {
       mask: [
           page.locator('.timestamp'),
           page.locator('.dynamic-chart')
       ]
   });
   ```

4. **Ensure consistent viewport:**
   ```typescript
   await page.setViewportSize({ width: 1280, height: 720 });
   ```

---

## Timeout Errors

**Default timeout is 30 seconds.** If you're hitting timeouts, the issue is usually:

1. **Slow network/API:** Use `waitForResponse()` instead of increasing timeout
2. **Element never appears:** Check your selector or application state
3. **Genuine performance issue:** Investigate why the app is slow

**Solutions:**

```typescript
// ❌ Don't just increase timeout globally
test.setTimeout(120000);

// ✅ Wait for specific condition
await page.waitForResponse(response => 
    response.url().includes('/api/data') && response.status() === 200
);

// ✅ Or check application state
await page.locator('.loading-spinner').waitFor({ state: 'detached' });
```

---

## Strict Mode Violations

**Error:** `locator.click: Error: strict mode violation: locator resolved to 2 elements`

**Cause:** Your selector matches multiple elements, and Playwright doesn't know which one to click.

**Solutions:**

1. **Make selector more specific:**
   ```typescript
   // ❌ Matches multiple buttons
   await page.locator('button').click();
   
   // ✅ Specific selector
   await page.locator('button[aria-label="Submit"]').click();
   
   // ✅ Or use role with name
   await page.getByRole('button', { name: 'Submit' }).click();
   ```

2. **Use `first()` if you genuinely want the first match:**
   ```typescript
   await page.locator('button').first().click();
   ```

3. **Use `nth()` for specific position:**
   ```typescript
   await page.locator('button').nth(2).click(); // Third button
   ```

4. **Filter by text content:**
   ```typescript
   await page.locator('button').filter({ hasText: 'Submit' }).click();
   ```

---

## Best Practices for Avoiding Issues

1. ✅ Use auto-retrying assertions (`expect`)
2. ✅ Trust Playwright's auto-waiting
3. ✅ Prefer accessible locators (`getByRole`, `getByLabel`)
4. ✅ Make selectors specific to avoid strict mode
5. ✅ Validate API responses with Zod schemas
6. ✅ Test in CI early and often
7. ❌ Never use `waitForTimeout()`
8. ❌ Don't increase timeouts without investigating root cause
