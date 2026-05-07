---
name: playwright-qa-review
description: "Analyze Playwright CLI annotated screenshots and metadata, then generate QA artifacts: bug reports, test cases, Playwright draft tests, visual diff masks, accessibility risks, QA checklist, Jira tickets, and MVP ideas. Use when user mentions annotate/annotation/playwright-cli review/bug report from screenshot."
license: MIT
metadata:
  author: XFaramirX
  version: "1.0.0"
---

# Playwright QA Review Skill

This skill turns Playwright CLI annotation output into structured QA deliverables.

## Trigger Phrases

Use this skill for prompts containing terms like:
- playwright-cli review
- annotated screenshot analysis
- generate bug report from annotation
- visual diff mask
- jira ticket from UI issue

## Required Inputs

- Screenshot path (example: `.playwright-cli/annotations-2026-05-01T22-36-56-798Z.png`)
- Annotation metadata lines, or equivalent JSON:

```text
{ x: 1037, y: 275, width: 167, height: 245 }: Elements not rendering responsively
{ x: 18, y: 275, width: 175, height: 319 }: Elements not rendering responsively.
{ x: 455, y: 167, width: 386, height: 50 }: This is neither center or anything
{ x: -25, y: 559, width: 45, height: 139 }: Spacing here is weird
```

- Optional snapshot path from `.playwright-cli/page-*.yml`

## Output Contract

Generate these outputs:
1. Bug report
2. Functional test cases
3. Edge cases
4. Accessibility risks
5. Playwright automation suggestions
6. Visual diff strategy and mask zones
7. Suggested selectors/locators
8. QA checklist
9. Jira-ready ticket payload

## Recommended Workflow

1. Run `playwright-cli goto <url>`
2. Run `playwright-cli show --annotate`
3. Save screenshot + annotation metadata as JSON
4. Feed both into the QA review pipeline script:
   - `npm run qa:annotate:review -- --url <url> --annotations-file <file>`
5. Review generated artifacts in `reports/qa-review/<timestamp>/`

## Quality Rules

- Do not invent DOM details not evidenced by screenshot/snapshot/annotation metadata.
- If confidence is low for a specific section, return `Unable to complete` for that section.
- Prefer role-based Playwright locators (`getByRole`, `getByLabel`, `getByText`) before CSS selectors.
- Keep generated bug titles concise and action-focused.
