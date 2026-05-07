#!/usr/bin/env bash
# Automated conversation between 4 playwright-cli sessions.
# Usage: bash e2e/scripts/sessions/chat-convo.sh [rounds]
# Default: 3 rounds of conversation

ROUNDS=${1:-3}
DELAY=1.2  # seconds between messages

send() {
  local session="$1"
  local message="$2"
  echo "[session-$session] $message"
  npx playwright-cli --session="session-$session" fill 'input[placeholder="Type a message..."]' "$message" 2>/dev/null
  npx playwright-cli --session="session-$session" click 'button' 2>/dev/null
  sleep "$DELAY"
}

# ── Conversation script ──────────────────────────────────────────────────────

echo "Starting chat conversation — $ROUNDS rounds..."
echo ""

for round in $(seq 1 "$ROUNDS"); do
  echo "── Round $round ─────────────────────────────"

  send 1 "Round $round: anyone home? 👋"
  send 2 "session-2 here — loud and clear 📡"
  send 3 "session-3 checking in from network tab 🔍"
  send 4 "session-4 ready — just took a screenshot 📸"

  send 1 "cool, round $round running. let's test something..."
  send 2 "agreed — want me to mock the /send route?"
  send 3 "I can intercept the next request and log it"
  send 4 "or we could navigate somewhere new?"

  send 1 "let's keep it simple for now — round $round done ✅"

  echo ""
  sleep 1
done

echo "Conversation complete. Final message count:"
curl -s "http://localhost:3333/messages?since=0" | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  console.log('  Messages:', d.messages.length);
  console.log('  Online:  ', d.online.join(', '));
" 2>/dev/null || curl -s "http://localhost:3333/messages?since=0"
