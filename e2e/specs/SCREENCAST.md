# Screencast and WebMCP examples

Run the self-contained examples with the installed Chromium browser:

```bash
npx playwright test e2e/specs/screencast-features.spec.ts e2e/specs/video-options.spec.ts e2e/specs/webmcp.spec.ts --project=chromium
```

`screencast-features.spec.ts` records a form submission with `screencast.start`, styled action markers, a persistent overlay, chapter titles, and a live JPEG frame callback. The WebM receipt and first frame are attached to the test report. The output path is unique to the test, project, and retry. The recording is stopped and attached even when a flow assertion fails.

`video-options.spec.ts` demonstrates the built-in video fixture with 1920x1080, 60 fps, and CSS action decorations. Playwright attaches the video to the test result when the context closes. Both examples disable tracing locally; the manual screencast also disables the video fixture because an existing capture can take precedence over screencast settings. These settings do not change other tests.

To adapt the receipt for a real application, replace the intercepted demo page with the application URL and use appropriate role and label locators. Add chapters before meaningful transitions and use assertions to verify the result of each action. Avoid recording credentials or sensitive information in video, frames, or overlays. The `onFrame` callback receives JPEG data and metadata; this example retains only the first frame rather than accumulating all frames in memory.

`webmcp.spec.ts` launches a separate Chromium browser with `--enable-features=WebMCP`, registers an `add` tool on a local intercepted page, and verifies tool discovery, schema, and invocation. WebMCP is experimental; Firefox requires different preferences and WebKit does not implement it. A real page must register the tool before it can be called, and page-provided tool descriptions and results should be treated as untrusted.

Firefox and WebKit currently capture up to 25 distinct frames per second even when a higher recording frame rate is requested. Playwright preserves the page aspect ratio within the specified video bounds. Videos use VP9 encoding in Playwright 1.65.