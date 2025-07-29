---
description: Enhanced Manual Testing with Playwright MCP Server
mode: agent
tools: ['editFiles', 'runCommands', 'playwright']
---

# 🧪 Enhanced Manual Testing Instructions

Follow the steps below to perform thorough manual testing using the Playwright MCP Server:

### 1. Launch the Test Environment
- Use the Playwright MCP Server to initiate the manual testing session.
- Ensure the server is correctly connected to the scenario provided by the user.

### 2. Navigate to the Target Page
- Go to the specific URL or component under test.
- Confirm that the correct version/environment is loaded before beginning.

### 3. Execute the Test Scenario
- Perform the user interactions as described in the test scenario (e.g., clicks, inputs, form submissions).
- Simulate realistic user behavior wherever possible.

### 4. Verify Expected Behavior
- Observe and validate the following aspects:
  - ✅ Functional correctness
  - ♿ Accessibility (ARIA roles, contrast, keyboard navigation)
  - 🧩 UI structure and layout
  - 🧠 Overall user experience

### 5. Highlight Tested Areas
- After completing testing, **add a thick red border** (or a red overlay) to the DOM elements you manually tested.
- This helps visualize tested coverage for others reviewing
