#!/usr/bin/env bash
# SESSION 4 — Screenshot & trace recorder agent
# Responsibility: capture visual evidence, record traces, save PDFs
#
# Usage:
#   bash e2e/scripts/sessions/session-4-record.sh

S="--session=session-4"
ARTIFACTS="e2e/reports/screenshots/session-4"
mkdir -p "$ARTIFACTS"

# ── Navigate ──────────────────────────────────────────────────────────────────
playwright-cli $S goto "https://playwright.dev"

# ── Full-page screenshot ──────────────────────────────────────────────────────
playwright-cli $S screenshot
# saved to .playwright-cli/ by default — move it:
# mv .playwright-cli/*.png "$ARTIFACTS/"

# ── Start a trace, do actions, stop + open ────────────────────────────────────
playwright-cli $S tracing-start

playwright-cli $S goto "https://playwright.dev/docs/intro"
playwright-cli $S snapshot
# playwright-cli $S click eXX

playwright-cli $S tracing-stop
# Open the trace in Trace Viewer:
# npx playwright show-trace trace.zip

# ── Save as PDF ───────────────────────────────────────────────────────────────
# playwright-cli $S pdf

# ── Resize viewport and screenshot again ─────────────────────────────────────
playwright-cli $S resize 375 812   # iPhone viewport
playwright-cli $S screenshot
playwright-cli $S resize 1280 800  # restore desktop
