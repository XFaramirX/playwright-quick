# Playwright SkillExecution Evals

This harness evaluates whether generated test work follows the skill's **How It Works** pipeline:

1. Analyze Requirements
2. Generate Files
3. A+ Quality Assurance

## Run

```bash
npm run eval:skill
```

Optional transcript evidence (recommended for process checks):

```bash
EVAL_TRANSCRIPT_FILE=e2e/scripts/logs/20260216_182525/unified.log npm run eval:skill:with-transcript
```

On Windows PowerShell:

```powershell
$env:EVAL_TRANSCRIPT_FILE = "e2e/scripts/logs/20260216_182525/unified.log"
npm run eval:skill:with-transcript
```

Strict process mode (fails process checks when transcript is missing):

```powershell
$env:EVAL_REQUIRE_TRANSCRIPT = "1"
$env:EVAL_TRANSCRIPT_FILE = "e2e/scripts/logs/20260216_182525/unified.log"
npm run eval:skill:with-transcript
```

## Inputs

- Cases: `evals/cases.json`
- Runtime evidence: `state.json` (from `state-reporter.js`)
- Optional process evidence: transcript file via `EVAL_TRANSCRIPT_FILE`

## Outputs

Artifacts are written to `evals/artifacts/`:

- `test-01.json`
- `test-02.json`
- `test-03.json`
- `summary.json`

Each artifact includes:

```json
"evaluation": {
  "skillExecution": {
    "score": 100,
    "overall_pass": true,
    "checks": [
      {
        "id": "outcome_task_complete",
        "category": "Outcome",
        "pass": true,
        "notes": "Passed"
      }
    ]
  }
}
```

## Notes

- If no transcript is provided, process checks are marked as skipped and pass by default.
- Set `EVAL_REQUIRE_TRANSCRIPT=1` to enforce strict process evidence.
