#!/usr/bin/env bash
# SESSION 1 — Navigation & exploration agent
# Responsibility: navigate pages, take snapshots, extract structure
#
# Usage:
#   bash e2e/scripts/sessions/session-1-navigate.sh
# Or run individual commands:
#   playwright-cli --session=session-1 snapshot

S="--session=session-1"

# ── Navigate ──────────────────────────────────────────────────────────────────
playwright-cli $S goto "https://playwright.dev"

# ── Explore the page structure ────────────────────────────────────────────────
playwright-cli $S snapshot

# ── Click into Docs ───────────────────────────────────────────────────────────
# (replace eXX with the ref from snapshot output above)
# playwright-cli $S click eXX

# ── Navigate sub-pages ───────────────────────────────────────────────────────
# playwright-cli $S goto "https://playwright.dev/docs/intro"
# playwright-cli $S snapshot
# playwright-cli $S go-back

# ── Open extra tabs ──────────────────────────────────────────────────────────
# playwright-cli $S tab-new "https://playwright.dev/docs/api/class-browser"
# playwright-cli $S tab-list
# playwright-cli $S tab-select 1

echo ""
echo "Session 1 done. Generated code above ↑"
echo "Next: grep 'await page' your terminal output to collect the test lines."
