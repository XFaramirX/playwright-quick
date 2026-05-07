/**
 * Excalidraw page selectors
 * Centralized selector management for maintainability
 */

export const ExcalidrawSelectors = {
  // Tool selectors - these are radio buttons
  tools: {
    selection: 'input[type="radio"][aria-label="Selection"]',
    hand: 'input[type="radio"][aria-label="Hand (panning tool)"]',
    rectangle: 'input[type="radio"][aria-label="Rectangle"]',
    diamond: 'input[type="radio"][aria-label="Diamond"]',
    ellipse: 'input[type="radio"][aria-label="Ellipse"]',
    arrow: 'input[type="radio"][aria-label="Arrow"]',
    line: 'input[type="radio"][aria-label="Line"]',
    draw: 'input[type="radio"][aria-label="Draw"]',
    text: 'input[type="radio"][aria-label="Text"]',
    image: 'input[type="radio"][aria-label="Insert image"]',
    eraser: 'input[type="radio"][aria-label="Eraser"]',
    moreTools: 'button:has-text("More tools")',
  },
  
  // Canvas area
  canvas: {
    drawingArea: 'canvas.excalidraw__canvas.interactive',
  },
  
  // Action buttons
  actions: {
    open: 'button:has-text("Open")',
    help: 'button:has-text("Help")',
    liveCollaboration: 'button:has-text("Live collaboration")',
    signUp: 'link:has-text("Sign up")',
    zoomIn: 'button[aria-label="Zoom in"]',
    zoomOut: 'button[aria-label="Zoom out"]',
    resetZoom: 'button:has-text("100%")',
    undo: 'button[aria-label="Undo"]',
    redo: 'button[aria-label="Redo"]',
  },
  
  // Library
  library: {
    libraryToggle: '.sidebar-trigger',
    browseLibraries: 'link:has-text("Browse libraries")',
  },
  
  // Welcome screen
  welcome: {
    closeButton: 'button:has-text("Close")',
    storageNotice: 'text=Your drawings are saved in your browser\'s storage',
  },
} as const;
