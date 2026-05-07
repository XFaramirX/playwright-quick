#!/usr/bin/env bash
# SESSION 3 — Network & storage inspector agent
# Responsibility: intercept requests, inspect cookies/storage, mock APIs
#
# Usage:
#   bash e2e/scripts/sessions/session-3-network.sh

S="--session=session-3"

# ── Navigate ──────────────────────────────────────────────────────────────────
playwright-cli $S goto "https://playwright.dev"

# ── Inspect current network activity ─────────────────────────────────────────
playwright-cli $S network

# ── Inspect storage ──────────────────────────────────────────────────────────
playwright-cli $S cookie-list
playwright-cli $S localstorage-list

# ── Console messages ─────────────────────────────────────────────────────────
playwright-cli $S console

# ── Mock an API endpoint ──────────────────────────────────────────────────────
# playwright-cli $S route "/api/user"
# playwright-cli $S reload
# playwright-cli $S route-list
# playwright-cli $S unroute "/api/user"

# ── Record a trace of the session ────────────────────────────────────────────
# playwright-cli $S tracing-start
# ... do actions ...
# playwright-cli $S tracing-stop
# npx playwright show-trace trace.zip
