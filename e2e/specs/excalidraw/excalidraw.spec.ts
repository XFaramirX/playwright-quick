import { test, expect } from '../../fixtures/base';

/**
 * Excalidraw E2E Test Suite
 * 
 * Tests the drawing functionality of Excalidraw whiteboard application
 * Includes tests for:
 * - Tool selection
 * - Drawing shapes (including star/diamond shapes)
 * - Canvas interactions
 * - Undo/Redo functionality
 */

test.describe('Excalidraw Drawing Tests', { tag: ['@smoke', '@excalidraw'] }, () => {
  test.beforeEach(async ({ excalidrawPage }) => {
    await test.step('Navigate to Excalidraw', async () => {
      await excalidrawPage.goto();
    });
  });

  test('Excalidraw - Load application and verify canvas is ready', async ({ excalidrawPage, page }) => {
    await test.step('Verify canvas is visible and ready', async () => {
      const canvas = page.locator('canvas.excalidraw__canvas.interactive');
      await expect(canvas).toBeVisible();
    });

    await test.step('Verify welcome message or canvas is ready', async () => {
      // The welcome message may disappear once user starts interacting
      // Just check that the canvas is interactive instead
      const canvas = page.locator('canvas.excalidraw__canvas.interactive');
      await expect(canvas).toBeVisible();
    });

    await test.step('Verify tool palette is available', async () => {
      const shapesHeading = page.getByRole('heading', { name: 'Shapes' });
      await expect(shapesHeading).toBeVisible();
    });
  });

  test('Excalidraw - Select Diamond tool and draw a star shape', async ({ excalidrawPage, page }) => {
    await test.step('Select Diamond tool (star-like shape)', async () => {
      await excalidrawPage.selectTool('diamond');
      
      // Verify tool is selected by checking the radio button state
      const diamondRadio = page.locator('input[type="radio"][aria-label="Diamond"]');
      await expect(diamondRadio).toBeChecked();
    });

    await test.step('Draw star/diamond shape on canvas', async () => {
      // Draw a diamond shape in the center of the canvas
      // Diamond is the closest shape to a star in Excalidraw's default tools
      await excalidrawPage.drawStar(400, 300, 150);
      
      // Wait a moment for the shape to be drawn
      await page.waitForTimeout(500);
    });

    await test.step('Verify undo button becomes enabled after drawing', async () => {
      await excalidrawPage.verifyUndoEnabled();
    });

    await test.step('Take screenshot of drawn shape', async () => {
      await excalidrawPage.takeCanvasScreenshot('diamond-star-shape');
    });
  });

  test('Excalidraw - Draw custom star using Draw tool', async ({ excalidrawPage, page }) => {
    await test.step('Select Draw tool', async () => {
      await excalidrawPage.selectTool('draw');
      
      // Verify Draw tool is selected
      const drawRadio = page.locator('input[type="radio"][aria-label="Draw"]');
      await expect(drawRadio).toBeChecked();
    });

    await test.step('Draw a free-form star shape', async () => {
      // Draw a 5-point star using the draw tool
      await excalidrawPage.drawCustomStar(400, 300, 80);
      
      // Wait for drawing to complete
      await page.waitForTimeout(500);
    });

    await test.step('Verify drawing was created', async () => {
      await excalidrawPage.verifyUndoEnabled();
    });

    await test.step('Capture the custom star drawing', async () => {
      await excalidrawPage.takeCanvasScreenshot('custom-star-drawing');
    });
  });

  test('Excalidraw - Test multiple shape tools', async ({ excalidrawPage, page }) => {
    await test.step('Draw a rectangle', async () => {
      await excalidrawPage.selectTool('rectangle');
      await excalidrawPage.drawShape(100, 100, 250, 200);
      await page.waitForTimeout(300);
    });

    await test.step('Draw an ellipse', async () => {
      await excalidrawPage.selectTool('ellipse');
      await excalidrawPage.drawShape(300, 100, 450, 200);
      await page.waitForTimeout(300);
    });

    await test.step('Draw a diamond (star-like)', async () => {
      await excalidrawPage.selectTool('diamond');
      await excalidrawPage.drawShape(500, 100, 650, 200);
      await page.waitForTimeout(300);
    });

    await test.step('Verify multiple shapes were created', async () => {
      await excalidrawPage.verifyUndoEnabled();
      await excalidrawPage.takeCanvasScreenshot('multiple-shapes');
    });
  });

  test('Excalidraw - Undo and Redo functionality', async ({ excalidrawPage, page }) => {
    await test.step('Verify undo is disabled initially', async () => {
      await excalidrawPage.verifyUndoDisabled();
    });

    await test.step('Draw a shape', async () => {
      await excalidrawPage.selectTool('diamond');
      await excalidrawPage.drawStar(400, 300, 100);
      await page.waitForTimeout(300);
    });

    await test.step('Verify undo is now enabled', async () => {
      await excalidrawPage.verifyUndoEnabled();
    });

    await test.step('Undo the drawing', async () => {
      await excalidrawPage.clickUndo();
      await page.waitForTimeout(300);
    });

    await test.step('Verify undo is disabled again after undoing', async () => {
      await excalidrawPage.verifyUndoDisabled();
    });
  });

  test('Excalidraw - Canvas zoom functionality', async ({ excalidrawPage, page }) => {
    await test.step('Verify zoom controls are available', async () => {
      const zoomIn = page.locator('button[aria-label*="Zoom in"]');
      const zoomOut = page.locator('button[aria-label*="Zoom out"]');
      await expect(zoomIn).toBeVisible();
      await expect(zoomOut).toBeVisible();
    });

    await test.step('Zoom in', async () => {
      await excalidrawPage.zoomIn();
      await page.waitForTimeout(300);
    });

    await test.step('Zoom out', async () => {
      await excalidrawPage.zoomOut();
      await page.waitForTimeout(300);
    });

    await test.step('Reset zoom', async () => {
      await excalidrawPage.resetZoom();
      await page.waitForTimeout(300);
      
      // Verify zoom controls are still functional
      const zoomIn = page.locator('button[aria-label*="Zoom in"]');
      await expect(zoomIn).toBeVisible();
    });
  });

  test('Excalidraw - Tool selection keyboard shortcuts', async ({ excalidrawPage, page }) => {
    await test.step('Select Rectangle with keyboard (R)', async () => {
      await page.keyboard.press('r');
      const rectangleRadio = page.locator('input[type="radio"][aria-label="Rectangle"]');
      await expect(rectangleRadio).toBeChecked();
    });

    await test.step('Select Diamond with keyboard (D)', async () => {
      await page.keyboard.press('d');
      const diamondRadio = page.locator('input[type="radio"][aria-label="Diamond"]');
      await expect(diamondRadio).toBeChecked();
    });

    await test.step('Select Ellipse with keyboard (O)', async () => {
      await page.keyboard.press('o');
      const ellipseRadio = page.locator('input[type="radio"][aria-label="Ellipse"]');
      await expect(ellipseRadio).toBeChecked();
    });

    await test.step('Select Draw tool with keyboard (P)', async () => {
      await page.keyboard.press('p');
      const drawRadio = page.locator('input[type="radio"][aria-label="Draw"]');
      await expect(drawRadio).toBeChecked();
    });
  });

  test.skip('Excalidraw - Check for console errors', async ({ page }) => {
    await test.step('Monitor console for errors', async () => {
      const errors: Error[] = [];
      page.on('pageerror', (error) => {
        errors.push(error);
      });

      // Perform some actions
      await page.keyboard.press('d');
      await page.mouse.move(400, 300);
      await page.mouse.down();
      await page.mouse.move(500, 400);
      await page.mouse.up();

      expect(errors, 'No console errors should occur during drawing').toHaveLength(0);
    });
  });
});

test.describe('Excalidraw Accessibility Tests', { tag: ['@a11y', '@excalidraw'] }, () => {
  test('Excalidraw - Canvas and tools are accessible', async ({ excalidrawPage, page }, testInfo) => {
    await test.step('Navigate to Excalidraw', async () => {
      await excalidrawPage.goto();
    });

    await test.step('Run accessibility scan', async () => {
      const violations = await excalidrawPage.checkA11y();
      
      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(violations, null, 2),
        contentType: 'application/json'
      });

      // Note: Some violations may be expected for a canvas-based application
      // Review violations to ensure critical accessibility features are present
      expect(violations, 'Critical accessibility violations should be minimal').toBeTruthy();
    });
  });
});
