# Advanced Patterns Reference

Read this file when you need detailed guidance on advanced testing patterns beyond basic test creation.

## Table of Contents
- [Constants Management](#constants-management)
- [Force Click Pattern](#force-click-pattern)
- [Action Verification](#action-verification)
- [Canvas Testing](#canvas-testing)
- [No Hard Waits Policy](#no-hard-waits-policy)
- [Geolocation Testing](#geolocation-testing)
- [Console Error Detection](#console-error-detection)
- [Link Validation](#link-validation)

---

## Constants Management (A+ Pattern)

Always extract magic numbers to a constants file for maintainability.

**Structure:**

```typescript
// pages/feature/constants.ts
export const CANVAS_COORDINATES = {
    center: { x: 400, y: 300 },
    offsetFromCenter: { x: 50, y: 50 }
};

export const SHAPE_SIZES = {
    small: 50,
    medium: 100,
    large: 150
};

export const DRAWING_AREAS = {
    topLeft: { startX: 100, startY: 100, endX: 200, endY: 150 },
    topRight: { startX: 600, startY: 100, endX: 700, endY: 150 }
};

export const CONFIG = {
    animationDuration: 300,
    debounceDelay: 500,
    retryAttempts: 3
};
```

**Usage:**

```typescript
import { CANVAS_COORDINATES, SHAPE_SIZES } from '../pages/feature/constants';

// ✅ Self-documenting
await featurePage.drawShape(
    CANVAS_COORDINATES.center.x,
    CANVAS_COORDINATES.center.y,
    SHAPE_SIZES.large
);

// ❌ Magic numbers
await featurePage.drawShape(400, 300, 150);
```

---

## Force Click Pattern (When Appropriate)

Force clicks should be rare and always documented.

**Template:**

```typescript
async selectTool(tool: string): Promise<void> {
    const toolSelector = this.selectors.tools[tool];
    
    // Note: force: true is necessary because [App Name]'s radio buttons have SVG child elements
    // that intercept pointer events. This is a valid use case for force clicks.
    await this.page.locator(toolSelector).click({ force: true });
    
    // CRITICAL: Always verify the action succeeded
    await expect(this.page.locator(toolSelector)).toBeChecked();
}
```

**Guidelines:**
- ✅ Use only when DOM structure prevents normal clicks
- ✅ Add inline comment explaining WHY
- ✅ Always verify with assertion after force click
- ❌ Never use to bypass test failures
- ❌ Never use without clear documentation

---

## Action Verification (A+ Required)

Always verify actions succeeded before proceeding.

**Correct Patterns:**

```typescript
// ✅ Verify tool selection
async selectTool(tool: string): Promise<void> {
    await this.page.locator(toolSelector).click();
    await expect(this.page.locator(toolSelector)).toBeChecked();
}

// ✅ Verify navigation
async navigateToPage(url: string): Promise<void> {
    await this.page.goto(url);
    await expect(this.page).toHaveURL(url);
}

// ✅ Verify form field filled
async fillField(field: string, value: string): Promise<void> {
    await this.page.getByLabel(field).fill(value);
    await expect(this.page.getByLabel(field)).toHaveValue(value);
}
```

**Anti-pattern:**

```typescript
// ❌ No verification - test continues with unknown state
async selectTool(tool: string): Promise<void> {
    await this.page.locator(toolSelector).click();
    // What if it didn't work? Test will fail mysteriously later!
}
```

---

## Canvas Testing

Special considerations for canvas-based applications.

**Coordinate Calculation:**

```typescript
// Get canvas bounding box for coordinate calculations
const canvas = this.page.locator('canvas.interactive');
const box = await canvas.boundingBox();
if (!box) throw new Error('Canvas not found');

// Calculate click coordinates
const centerX = box.x + box.width / 2;
const centerY = box.y + box.height / 2;

// Perform drawing with mouse actions
await this.page.mouse.move(centerX, centerY);
await this.page.mouse.down();
await this.page.mouse.move(centerX + 100, centerY + 100);
await this.page.mouse.up();
```

---

## No Hard Waits Policy (CRITICAL)

**NEVER use `page.waitForTimeout()` - Here's why:**

**❌ ANTI-PATTERN:**
```typescript
await page.click('button');
await page.waitForTimeout(500); // Breaks on slow machines, wastes time on fast
await expect(page.locator('.result')).toBeVisible();
```

**✅ CORRECT PATTERNS:**

```typescript
// Pattern 1: Auto-retrying assertion (BEST)
await page.click('button');
await expect(page.locator('.result')).toBeVisible(); // Waits automatically!

// Pattern 2: Wait for network idle
await page.click('button');
await page.waitForLoadState('networkidle');

// Pattern 3: Wait for specific request
const responsePromise = page.waitForResponse('**/api/data');
await page.click('button');
await responsePromise;

// Pattern 4: Wait for element state
await page.click('button');
await page.locator('.spinner').waitFor({ state: 'detached' });
await expect(page.locator('.result')).toBeVisible();
```

**Why this matters:**
- Playwright's auto-waiting is highly optimized
- Auto-retrying assertions more reliable than fixed timeouts
- Tests run faster on fast machines, still work on slow ones
- Framework guidelines explicitly forbid hard waits

---

## Geolocation Testing

```typescript
const geolocationUsers = {
    eastCoast: {
        geolocation: { longitude: -74.006, latitude: 40.7128 },
        timezoneId: "America/New_York"
    }
};
```

---

## Console Error Detection

```typescript
test('should not have console errors', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (error) => {
        errors.push(error);
    });
    // Perform actions
    expect(errors).toHaveLength(0);
});
```

---

## Link Validation

```typescript
const linkUrls = await homePage.getAllLinksFromPage(page);
for (const url of linkUrls) {
    const response = await page.request.get(url);
    expect.soft(response.ok()).toBeTruthy();
}
```
