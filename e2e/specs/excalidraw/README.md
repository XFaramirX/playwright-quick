# Excalidraw E2E Test Suite

## Overview

Comprehensive end-to-end test suite for [Excalidraw](https://excalidraw.com/) - an open-source virtual whiteboard application. This suite tests drawing functionality, tool selection, canvas interactions, and accessibility compliance.

## Test Coverage

### Functional Tests (`@smoke`, `@excalidraw`)

1. **Application Load & Canvas Ready**
   - Verifies canvas visibility and readiness
   - Checks welcome message display
   - Validates tool palette availability

2. **Diamond/Star Shape Drawing**
   - Selects Diamond tool (closest to a star shape)
   - Draws diamond shape on canvas
   - Verifies undo functionality is enabled
   - Captures screenshot of drawn shape

3. **Custom Star Drawing with Draw Tool**
   - Uses freehand Draw tool
   - Creates a 5-point star programmatically
   - Validates drawing completion
   - Takes screenshot of custom star

4. **Multiple Shape Tools**
   - Tests Rectangle, Ellipse, and Diamond tools
   - Draws multiple shapes in sequence
   - Verifies all shapes are created successfully

5. **Undo/Redo Functionality**
   - Tests initial undo state (disabled)
   - Draws a shape and verifies undo enabled
   - Undoes the action and verifies state

6. **Canvas Zoom Controls**
   - Verifies initial 100% zoom level
   - Tests zoom in/out functionality
   - Resets zoom and validates

7. **Keyboard Shortcuts**
   - Tests tool selection via keyboard (R, D, O, P)
   - Verifies correct tool activation

### Accessibility Tests (`@a11y`, `@excalidraw`)

1. **Canvas & Tools Accessibility**
   - Runs axe-core accessibility scan
   - Generates violation report
   - Validates critical accessibility features

## File Structure

```
e2e/
├── fixtures/
│   └── base.ts                      # Updated with excalidrawPage fixture
├── pages/
│   └── excalidraw/
│       ├── excalidraw.page.ts       # Page Object Model
│       └── selectors.ts             # Centralized selectors
└── specs/
    └── excalidraw/
        └── excalidraw.spec.ts       # Test specifications
```

## Page Object Features

### ExcalidrawPage Methods

| Method | Description |
|--------|-------------|
| `goto(url)` | Navigate to Excalidraw and wait for canvas |
| `selectTool(tool)` | Select a drawing tool (uses keyboard shortcuts) |
| `drawShape(x1, y1, x2, y2)` | Draw a shape by dragging |
| `drawStar(x, y, size)` | Draw a diamond/star shape |
| `drawCustomStar(x, y, radius)` | Draw a 5-point star with Draw tool |
| `clickUndo()` / `clickRedo()` | Undo/Redo actions |
| `verifyUndoEnabled()` / `verifyUndoDisabled()` | Check undo button state |
| `zoomIn()` / `zoomOut()` / `resetZoom()` | Canvas zoom controls |
| `takeCanvasScreenshot(name)` | Capture canvas screenshot |

## Running the Tests

### Run All Excalidraw Tests

```bash
npx playwright test excalidraw
```

### Run Specific Test Tags

```bash
# Run only smoke tests
npx playwright test --grep @excalidraw --grep @smoke

# Run accessibility tests
npx playwright test --grep @a11y
```

### Run Specific Test

```bash
npx playwright test -g "Select Diamond tool and draw a star shape"
```

### Run in UI Mode

```bash
npx playwright test excalidraw --ui
```

### Run in Debug Mode

```bash
PWDEBUG=1 npx playwright test excalidraw
```

### Run with Headed Browser

```bash
npx playwright test excalidraw --headed
```

## Test Results

Screenshots of drawn shapes are saved to:
```
e2e/reports/screenshots/
├── diamond-star-shape.png
├── custom-star-drawing.png
└── multiple-shapes.png
```

## Important Notes

### About the "Star" Shape

Excalidraw does not have a built-in star tool. The tests use two approaches:

1. **Diamond Tool** - The diamond shape is the closest to a star in Excalidraw's default tools
2. **Draw Tool** - Creates a custom 5-point star programmatically using the freehand draw tool

### Canvas Coordinates

- Canvas interactions use relative coordinates
- The `drawShape()` method automatically calculates absolute positions
- Default canvas center: approximately (400, 300)

### Timing Considerations

- Tests include small waits (`waitForTimeout`) after drawing actions
- This ensures shapes are fully rendered before verification
- These can be replaced with better wait strategies if needed

## Key Implementation Details

### Selector Strategy

The test suite uses **direct radio button selectors** for tool selection:
```typescript
// Correct selector - targets the radio input directly
'input[type="radio"][aria-label="Diamond"]'

// Canvas selector - targets the interactive canvas
'canvas.excalidraw__canvas.interactive'
```

**Why this works:**
- Excalidraw has 2 canvas elements (static and interactive)
- Tools are radio button inputs, not generic containers
- Direct element targeting avoids strict mode violations

### Drawing Mechanism

Drawing works by:
1. Selecting a tool via radio button click
2. Getting interactive canvas bounding box
3. Calculating absolute coordinates from relative positions
4. Using Playwright's mouse API to drag and draw

## Known Issues & Limitations

1. **Canvas-based Application**: Excalidraw uses HTML5 Canvas, which has limited accessibility support
2. **Shape Verification**: Direct verification of drawn shapes requires visual comparison or additional tooling
3. **Coordinate System**: Coordinates may vary based on viewport size
4. **UI Elements**: Some UI indicators (welcome message, zoom %) may hide dynamically

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Excalidraw Tests
  run: npx playwright test excalidraw --project=chromium
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: excalidraw-test-results
    path: |
      playwright-report/
      e2e/reports/screenshots/
```

## Extending the Tests

### Adding New Shape Tests

```typescript
test('Draw a new shape', async ({ excalidrawPage, page }) => {
  await excalidrawPage.selectTool('arrow');
  await excalidrawPage.drawShape(100, 100, 300, 200);
  await excalidrawPage.verifyUndoEnabled();
});
```

### Testing Text Elements

```typescript
test('Add text to canvas', async ({ excalidrawPage, page }) => {
  await excalidrawPage.selectTool('text');
  const canvas = page.locator('[aria-label="Drawing canvas"]');
  await canvas.click({ position: { x: 400, y: 300 } });
  await page.keyboard.type('Hello Excalidraw!');
});
```

## Maintenance

- **Selectors**: All selectors are centralized in `selectors.ts`
- **Update Frequency**: Review selectors when Excalidraw updates
- **Accessibility**: Re-run a11y tests after major Excalidraw updates

## References

- [Excalidraw Official Site](https://excalidraw.com/)
- [Excalidraw GitHub](https://github.com/excalidraw/excalidraw)
- [Playwright Documentation](https://playwright.dev/)
- [Framework Guidelines](../../../.agents/skills/playwright-e2e/SKILL.md)

---

**Last Updated**: March 23, 2026  
**Test Count**: 8 functional + 1 accessibility test  
**Estimated Run Time**: ~2-3 minutes
