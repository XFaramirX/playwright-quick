#!/usr/bin/env bash
# Start 4 headed Playwright browser sessions in separate terminal tabs/panes.
# Each session binds under a unique name so playwright-cli can target them independently.
#
# Usage:
#   bash e2e/scripts/sessions/start-sessions.sh
#
# After running, connect with:
#   playwright-cli --session=session-1 snapshot
#   playwright-cli --session=session-2 goto "https://example.com"
#   playwright-cli list   ← shows all running sessions

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SPEC="e2e/specs/debug-session.spec.ts"
LOG_DIR="$ROOT/e2e/scripts/sessions/logs"
mkdir -p "$LOG_DIR"

echo "Starting 4 browser sessions..."
echo "Logs → $LOG_DIR"
echo ""

for i in 1 2 3 4; do
    SESSION="session-$i"
    LOG="$LOG_DIR/$SESSION.log"
    
    SESSION_NAME="$SESSION" npx --prefix "$ROOT" playwright test "$SPEC" \
    --project=chromium \
    --headed \
    --timeout=300000 \
    > "$LOG" 2>&1 &
    playwright-cli --session=$SESSION open
    
    echo "[$i] $SESSION  (pid $!)  log: $LOG"
done

echo ""
echo "Waiting for sessions to bind..."
sleep 5

echo ""
npx --prefix "$ROOT" playwright-cli list
echo ""
echo "Connect with:  playwright-cli --session=session-1 snapshot"
