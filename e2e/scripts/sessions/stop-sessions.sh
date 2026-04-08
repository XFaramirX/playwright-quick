#!/usr/bin/env bash
# Stop all running playwright-cli sessions and kill background test processes.
#
# Usage:
#   bash e2e/scripts/sessions/stop-sessions.sh

echo "Stopping all sessions..."
npx playwright-cli close-all 2>/dev/null || true
npx playwright-cli kill-all  2>/dev/null || true

# Kill any background playwright test workers spawned by start-sessions.sh
pkill -f "debug-session.spec.ts" 2>/dev/null && echo "Killed test workers" || echo "No test workers running"

echo "Done. Active sessions:"
npx playwright-cli list
