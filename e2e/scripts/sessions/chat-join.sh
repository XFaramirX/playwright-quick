#!/usr/bin/env bash
# Navigate all 4 sessions to the chat server
# Run AFTER: node e2e/scripts/sessions/chat-server.js

BASE="http://localhost:3333"

for i in 1 2 3 4; do
  echo "Connecting session-$i to chat..."
  npx playwright-cli --session="session-$i" goto "$BASE?name=session-$i"
done

echo ""
echo "All sessions connected. Mock an intercept (optional):"
echo "  npx playwright-cli --session=session-1 route '/send' --body '{\"ok\": false}'"
echo ""
echo "Send a test message from session-1:"
echo "  npx playwright-cli --session=session-1 fill '#input' 'hello from session 1'"
echo "  npx playwright-cli --session=session-1 click 'button:has-text(\"Send\")'"
