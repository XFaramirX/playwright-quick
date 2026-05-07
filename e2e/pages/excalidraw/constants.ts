/**
 * Excalidraw test constants
 * Centralized configuration values for maintainability
 */

export const CANVAS_COORDINATES = {
  center: { x: 400, y: 300 },
  topLeft: { x: 100, y: 100 },
  topCenter: { x: 400, y: 100 },
} as const;

export const SHAPE_SIZES = {
  small: 50,
  medium: 100,
  large: 150,
} as const;

export const DRAWING_AREAS = {
  rectangle1: { startX: 100, startY: 100, endX: 250, endY: 200 },
  rectangle2: { startX: 300, startY: 100, endX: 450, endY: 200 },
  rectangle3: { startX: 500, startY: 100, endX: 650, endY: 200 },
} as const;

export const STAR_CONFIG = {
  points: 10, // 5 outer + 5 inner points
  innerRadiusRatio: 0.4,
} as const;

export const HEART_CONFIG = {
  points: 80,
  xScale: 1,
  yScale: 1,
} as const;
