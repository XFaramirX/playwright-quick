#!/usr/bin/env bash
# SESSION 2 — Form interaction & login agent
# Responsibility: fill forms, submit, capture generated locator code
#
# Usage:
#   bash e2e/scripts/sessions/session-2-forms.sh

S="--session=session-2"
GENERATED="e2e/scripts/sessions/logs/session-2-generated.txt"

run() {
  # Print + capture all "await page" lines automatically
  playwright-cli $S "$@" 2>&1 | tee -a "$GENERATED"
}

mkdir -p "$(dirname "$GENERATED")"
> "$GENERATED"  # clear previous run

# ── Navigate to login page ────────────────────────────────────────────────────
run goto "https://practice.expandtesting.com/login"
run snapshot

# ── Fill credentials ──────────────────────────────────────────────────────────
# After running snapshot, replace eXX with actual refs
# run fill eXX "practice"
# run fill eXX "SuperSecretPassword!"
# run click eXX   # submit button

# ── After login: capture state for reuse in other tests ──────────────────────
# run state-save "e2e/fixtures/auth.json"

echo ""
echo "Generated code saved to: $GENERATED"
echo ""
grep "await page" "$GENERATED" 2>/dev/null && echo "" || echo "(no generated lines yet — run snapshot + actions first)"
