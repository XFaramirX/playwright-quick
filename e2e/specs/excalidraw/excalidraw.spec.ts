import { test, expect } from '../../fixtures/base';
import { CANVAS_COORDINATES, SHAPE_SIZES, DRAWING_AREAS } from '../../pages/excalidraw/constants';

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
      await excalidrawPage.drawStar(CANVAS_COORDINATES.center.x, CANVAS_COORDINATES.center.y, SHAPE_SIZES.large);
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
      await excalidrawPage.drawCustomStar(CANVAS_COORDINATES.center.x, CANVAS_COORDINATES.center.y, 80);
    });

    await test.step('Verify drawing was created', async () => {
      await excalidrawPage.verifyUndoEnabled();
    });

    await test.step('Capture the custom star drawing', async () => {
      await excalidrawPage.takeCanvasScreenshot('custom-star-drawing');
    });
  });

  test('Excalidraw - Draw heart shape using Draw tool', async ({ excalidrawPage, page }) => {
    await test.step('Select Draw tool and verify it is active', async () => {
      await excalidrawPage.selectTool('draw');
      const drawRadio = page.locator('input[type="radio"][aria-label="Draw"]');
      await expect(drawRadio).toBeChecked();
    });

    await test.step('Draw a heart in the center of the canvas', async () => {
      await excalidrawPage.drawHeart(
        CANVAS_COORDINATES.center.x,
        CANVAS_COORDINATES.center.y,
        SHAPE_SIZES.medium,
      );
    });

    await test.step('Verify drawing created a canvas change', async () => {
      await excalidrawPage.verifyUndoEnabled();
    });

    await test.step('Capture heart drawing screenshot', async () => {
      await excalidrawPage.takeCanvasScreenshot('heart-drawing');
    });
  });

  test('Excalidraw - Test multiple shape tools', async ({ excalidrawPage, page }) => {
    await test.step('Draw a rectangle', async () => {
      await excalidrawPage.selectTool('rectangle');
      const area = DRAWING_AREAS.rectangle1;
      await excalidrawPage.drawShape(area.startX, area.startY, area.endX, area.endY);
    });

    await test.step('Draw an ellipse', async () => {
      await excalidrawPage.selectTool('ellipse');
      const area = DRAWING_AREAS.rectangle2;
      await excalidrawPage.drawShape(area.startX, area.startY, area.endX, area.endY);
    });

    await test.step('Draw a diamond (star-like)', async () => {
      await excalidrawPage.selectTool('diamond');
      const area = DRAWING_AREAS.rectangle3;
      await excalidrawPage.drawShape(area.startX, area.startY, area.endX, area.endY);
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
      await excalidrawPage.drawStar(CANVAS_COORDINATES.center.x, CANVAS_COORDINATES.center.y, SHAPE_SIZES.medium);
    });

    await test.step('Verify undo is now enabled', async () => {
      await excalidrawPage.verifyUndoEnabled();
    });

    await test.step('Undo the drawing', async () => {
      await excalidrawPage.clickUndo();
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
    });

    await test.step('Zoom out', async () => {
      await excalidrawPage.zoomOut();
    });

    await test.step('Reset zoom', async () => {
      await excalidrawPage.resetZoom();
      
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
      // Focus on critical violations that impact usability
      // Filter out known Excalidraw issues (main menu button lacking aria-label)
      const criticalViolations = violations.filter((v: any) => 
        v.impact === 'critical' && v.id !== 'button-name'
      );
      expect(criticalViolations, 'No critical accessibility violations in user-testable areas').toHaveLength(0);
    });
  });
});
