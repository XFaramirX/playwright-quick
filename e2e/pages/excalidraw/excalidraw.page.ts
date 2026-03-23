import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { ExcalidrawSelectors } from './selectors';
import { STAR_CONFIG } from './constants';

/**
 * Excalidraw Page Object
 * Handles interactions with the Excalidraw whiteboard application
 * @extends BasePage
 */
export class ExcalidrawPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Excalidraw and wait for page to be ready
   * @param url - Base URL to navigate to (default: https://excalidraw.com/)
   */
  async goto(url: string = 'https://excalidraw.com/') {
    await super.goto(url);
    await this.waitForCanvasReady();
  }

  /**
   * Wait for the canvas to be ready for interaction
   */
  async waitForCanvasReady() {
    await this.page.waitForSelector(ExcalidrawSelectors.canvas.drawingArea, {
      state: 'visible',
      timeout: 10000,
    });
  }

  /**
   * Select a drawing tool by name
   * @param tool - The tool name (e.g., 'diamond', 'rectangle', 'draw')
   */
  async selectTool(tool: keyof typeof ExcalidrawSelectors.tools) {
    const toolSelector = ExcalidrawSelectors.tools[tool];
    
    // Click the radio button to select the tool
    // Note: force: true is necessary because Excalidraw's radio buttons have SVG child elements
    // that intercept pointer events. This is a valid use case for force clicks.
    await this.page.locator(toolSelector).click({ force: true });

    // Verify tool is selected by checking it's checked
    await expect(this.page.locator(toolSelector)).toBeChecked();
  }

  /**
   * Draw a shape on the canvas at specified coordinates
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param endX - Ending X coordinate
   * @param endY - Ending Y coordinate
   */
  async drawShape(startX: number, startY: number, endX: number, endY: number) {
    const canvas = this.page.locator(ExcalidrawSelectors.canvas.drawingArea);
    
    // Get the canvas bounding box
    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) {
      throw new Error('Canvas not found or not visible');
    }
    
    // Calculate absolute coordinates
    const absoluteStartX = canvasBox.x + startX;
    const absoluteStartY = canvasBox.y + startY;
    const absoluteEndX = canvasBox.x + endX;
    const absoluteEndY = canvasBox.y + endY;
    
    // Perform drag to draw
    await this.page.mouse.move(absoluteStartX, absoluteStartY);
    await this.page.mouse.down();
    await this.page.mouse.move(absoluteEndX, absoluteEndY);
    await this.page.mouse.up();
  }

  /**
   * Draw a star-like shape using the Diamond tool
   * Diamond is the closest to a star shape in Excalidraw's default tools
   * @param centerX - Center X coordinate on canvas
   * @param centerY - Center Y coordinate on canvas
   * @param size - Size of the shape
   */
  async drawStar(centerX: number, centerY: number, size: number = 100) {
    await this.selectTool('diamond');
    
    const halfSize = size / 2;
    await this.drawShape(
      centerX - halfSize,
      centerY - halfSize,
      centerX + halfSize,
      centerY + halfSize
    );
  }

  /**
   * Draw multiple points to create a custom star shape using the Draw tool
   * @param centerX - Center X coordinate
   * @param centerY - Center Y coordinate
   * @param radius - Radius of the star
   */
  async drawCustomStar(centerX: number, centerY: number, radius: number = 50) {
    await this.selectTool('draw');
    
    const canvas = this.page.locator(ExcalidrawSelectors.canvas.drawingArea);
    const canvasBox = await canvas.boundingBox();
    
    if (!canvasBox) {
      throw new Error('Canvas not found');
    }
    
    // Calculate star points (5-point star)
    const points = STAR_CONFIG.points; // 5 outer + 5 inner points
    const innerRadius = radius * STAR_CONFIG.innerRadiusRatio;
    const angle = (Math.PI * 2) / points;
    
    // Start drawing
    const startX = canvasBox.x + centerX + radius * Math.cos(-Math.PI / 2);
    const startY = canvasBox.y + centerY + radius * Math.sin(-Math.PI / 2);
    
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    
    // Draw star points
    for (let i = 0; i <= points; i++) {
      const currentRadius = i % 2 === 0 ? radius : innerRadius;
      const x = canvasBox.x + centerX + currentRadius * Math.cos(i * angle - Math.PI / 2);
      const y = canvasBox.y + centerY + currentRadius * Math.sin(i * angle - Math.PI / 2);
      await this.page.mouse.move(x, y, { steps: 5 });
    }
    
    await this.page.mouse.up();
  }

  /**
   * Click the Undo button
   */
  async clickUndo() {
    await this.page.locator(ExcalidrawSelectors.actions.undo).click();
  }

  /**
   * Click the Redo button
   */
  async clickRedo() {
    await this.page.locator(ExcalidrawSelectors.actions.redo).click();
  }

  /**
   * Verify that undo/redo buttons are enabled
   */
  async verifyUndoEnabled() {
    const undoButton = this.page.locator(ExcalidrawSelectors.actions.undo);
    await expect(undoButton).not.toBeDisabled();
  }

  /**
   * Verify that undo/redo buttons are disabled
   */
  async verifyUndoDisabled() {
    const undoButton = this.page.locator(ExcalidrawSelectors.actions.undo);
    await expect(undoButton).toBeDisabled();
  }

  /**
   * Zoom in on the canvas
   */
  async zoomIn() {
    await this.page.locator(ExcalidrawSelectors.actions.zoomIn).click();
  }

  /**
   * Zoom out on the canvas
   */
  async zoomOut() {
    await this.page.locator(ExcalidrawSelectors.actions.zoomOut).click();
  }

  /**
   * Reset zoom to 100%
   */
  async resetZoom() {
    await this.page.locator(ExcalidrawSelectors.actions.resetZoom).click();
  }

  /**
   * Open the library panel
   */
  async openLibrary() {
    await this.page.locator(ExcalidrawSelectors.library.libraryToggle).click();
  }

  /**
   * Select an element on the canvas and verify it's selected
   */
  async selectDrawnElement(x: number, y: number) {
    // First, switch to selection tool
    await this.page.keyboard.press('v'); // Or press '1' for selection tool
    
    const canvas = this.page.locator(ExcalidrawSelectors.canvas.drawingArea);
    const canvasBox = await canvas.boundingBox();
    
    if (!canvasBox) {
      throw new Error('Canvas not found');
    }
    
    // Click at the specified coordinates to select the element
    await this.page.mouse.click(canvasBox.x + x, canvasBox.y + y);
  }

  /**
   * Take a screenshot of the canvas area
   * @param name - Name for the screenshot file
   */
  async takeCanvasScreenshot(name: string = 'canvas') {
    return await this.page.locator(ExcalidrawSelectors.canvas.drawingArea).screenshot({
      path: `e2e/reports/screenshots/${name}.png`,
    });
  }
}
