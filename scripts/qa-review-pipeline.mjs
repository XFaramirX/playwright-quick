#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const cwd = process.cwd();

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = 'true';
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function latestFileByPrefix(dirPath, prefix) {
  if (!fs.existsSync(dirPath)) {
    return null;
  }
  const files = fs
    .readdirSync(dirPath)
    .filter((name) => name.startsWith(prefix))
    .map((name) => ({
      name,
      fullPath: path.join(dirPath, name),
      mtime: fs.statSync(path.join(dirPath, name)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0].fullPath : null;
}

function parseAnnotationLine(line) {
  const match = line.match(/^\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}:\s*(.+)$/);
  if (!match) {
    return null;
  }
  return {
    x: Number(match[1]),
    y: Number(match[2]),
    width: Number(match[3]),
    height: Number(match[4]),
    note: match[5].trim()
  };
}

function parseAnnotationText(rawText) {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseAnnotationLine)
    .filter(Boolean);
}

function severityFor(note) {
  const lower = note.toLowerCase();
  if (lower.includes('not rendering responsively') || lower.includes('off-screen')) {
    return 'Medium';
  }
  if (lower.includes('weird') || lower.includes('center')) {
    return 'Low';
  }
  return 'Low';
}

function impactFor(annotation) {
  if (annotation.x < 0) {
    return 'Element is partially outside viewport and content is clipped.';
  }
  if (annotation.note.toLowerCase().includes('responsively')) {
    return 'Layout may break on smaller viewports and degrade usability.';
  }
  if (annotation.note.toLowerCase().includes('center')) {
    return 'Banner alignment appears visually off-center, reducing UI quality.';
  }
  return 'Visual rendering issue impacts UI consistency.';
}

function buildBugReport(annotations, url) {
  return annotations.map((annotation, idx) => ({
    id: `BUG-${String(idx + 1).padStart(3, '0')}`,
    title: annotation.note,
    severity: severityFor(annotation.note),
    environment: 'Desktop web',
    url,
    stepsToReproduce: [
      `Open ${url}`,
      'Run playwright-cli show --annotate',
      'Observe annotated area'
    ],
    expected: 'Elements should stay fully visible, aligned, and responsive across viewports.',
    actual: annotation.note,
    impact: impactFor(annotation),
    area: {
      x: annotation.x,
      y: annotation.y,
      width: annotation.width,
      height: annotation.height
    }
  }));
}

function buildFunctionalTestCases(url) {
  return [
    {
      id: 'TC-FUNC-001',
      title: 'Login with valid credentials',
      precondition: `User is on ${url}`,
      steps: [
        'Enter username: practice',
        'Enter password: SuperSecretPassword!',
        'Click Login'
      ],
      expected: 'User is redirected to secure area and sees success state.'
    },
    {
      id: 'TC-FUNC-002',
      title: 'Login with invalid credentials',
      precondition: `User is on ${url}`,
      steps: [
        'Enter invalid username/password',
        'Click Login'
      ],
      expected: 'Error message is displayed and user remains on login page.'
    },
    {
      id: 'TC-FUNC-003',
      title: 'Responsive sidebars do not overlap content',
      precondition: `User is on ${url}`,
      steps: [
        'Set viewport to 1280x720',
        'Observe left and right sidebar panels'
      ],
      expected: 'Sidebars stay within viewport bounds and do not clip content.'
    },
    {
      id: 'TC-FUNC-004',
      title: 'Top information banner remains centered',
      precondition: `User is on ${url}`,
      steps: [
        'Observe the top prompt/banner section',
        'Compare horizontal center point against page center'
      ],
      expected: 'Banner is centered within parent container.'
    }
  ];
}

function buildEdgeCases() {
  return [
    'Viewport width at 320px, 375px, 768px, and 1024px',
    'Zoom level at 125% and 200%',
    'Long translated text in menu items causing wrapping',
    'Keyboard-only navigation through sidebars and form controls',
    'High-contrast mode and reduced motion enabled'
  ];
}

function buildAccessibilityRisks(annotations) {
  const risks = [
    'Potential focus order confusion if clipped elements remain tabbable',
    'Possible missing or ambiguous labels in sidebar navigation groups',
    'Off-screen content can degrade screen magnifier usability'
  ];

  if (annotations.some((a) => a.x < 0)) {
    risks.push('Detected negative x-coordinate annotation, indicating off-screen rendering risk.');
  }

  return risks;
}

function buildPlaywrightSuggestions() {
  return [
    'Use role/label-first locators: getByRole/getByLabel/getByText',
    'Assert URL transitions with toHaveURL after login',
    'Add viewport matrix tests (desktop/tablet/mobile) for layout checks',
    'Use toHaveScreenshot with mask zones for dynamic widgets',
    'Use toMatchAriaSnapshot for structural accessibility regression checks'
  ];
}

function buildLocators() {
  return {
    username: "page.getByLabel('Username')",
    password: "page.getByLabel('Password')",
    loginButton: "page.getByRole('button', { name: /login/i })",
    pageHeading: "page.getByRole('heading', { name: /test login page/i })",
    registerLink: "page.getByRole('link', { name: /here/i })",
    buyCoffee: "page.getByRole('link', { name: /buy us a coffee/i })",
    leftSidebarNav: "page.getByRole('navigation').first()",
    rightSidebarNav: "page.getByRole('navigation').last()"
  };
}

function buildVisualDiffMask(annotations) {
  return {
    strategy: 'Mask volatile or intentionally unstable regions while keeping structural checks strict.',
    zones: annotations.map((a, idx) => ({
      id: `MASK-${String(idx + 1).padStart(3, '0')}`,
      x: a.x,
      y: a.y,
      width: a.width,
      height: a.height,
      reason: a.note
    }))
  };
}

function buildQaChecklist() {
  return [
    { id: 'QA-001', check: 'Responsive rendering validated for primary breakpoints', status: 'todo' },
    { id: 'QA-002', check: 'No clipped or off-screen interactive elements', status: 'todo' },
    { id: 'QA-003', check: 'Form validation and error states verified', status: 'todo' },
    { id: 'QA-004', check: 'Keyboard navigation path validated', status: 'todo' },
    { id: 'QA-005', check: 'Color contrast and heading structure reviewed', status: 'todo' },
    { id: 'QA-006', check: 'Visual baseline approved and stored', status: 'todo' }
  ];
}

function buildJiraTickets(bugs) {
  return bugs.map((bug) => ({
    projectKey: 'QA',
    issueType: 'Bug',
    summary: `[UI] ${bug.title}`,
    description: [
      `Severity: ${bug.severity}`,
      `URL: ${bug.url}`,
      'Steps:',
      ...bug.stepsToReproduce.map((step, idx) => `${idx + 1}. ${step}`),
      `Expected: ${bug.expected}`,
      `Actual: ${bug.actual}`,
      `Impact: ${bug.impact}`,
      `Area: x=${bug.area.x}, y=${bug.area.y}, width=${bug.area.width}, height=${bug.area.height}`
    ].join('\n'),
    labels: ['ui-regression', 'responsive', 'playwright-cli'],
    priority: bug.severity === 'Medium' ? 'Medium' : 'Low'
  }));
}

function buildMvpIdea(url) {
  return {
    title: 'Annotated QA Copilot Pipeline',
    value: 'Convert manual UI annotations into instant QA artifacts and executable test drafts in under 2 minutes.',
    targetUsers: ['QA engineers', 'SDETs', 'Developers in PR review'],
    mvpFlow: [
      `Run playwright-cli goto ${url}`,
      'Run playwright-cli show --annotate and add issue boxes',
      'Save annotation metadata as JSON',
      'Run npm run qa:annotate:review with metadata file',
      'Use generated bug report, Jira payload, and test draft in sprint workflow'
    ],
    successMetrics: [
      'Reduce bug triage documentation time by >= 60%',
      'Increase screenshot-to-test conversion rate',
      'Standardize bug reporting format across QA team'
    ]
  };
}

function buildPromptPacket(input) {
  return [
    'You are a senior QA automation engineer.',
    'Analyze the screenshot and annotation metadata below.',
    'Return: bug report, functional test cases, edge cases, accessibility risks, Playwright automation suggestions, visual diff strategy, selectors, QA checklist, Jira ticket, and MVP idea.',
    'If unsure for a section, return exactly: Unable to complete',
    '',
    `URL: ${input.url}`,
    `Screenshot: ${input.screenshotPath || 'Unable to complete'}`,
    `Snapshot: ${input.snapshotPath || 'Unable to complete'}`,
    '',
    'Annotations JSON:',
    JSON.stringify(input.annotations, null, 2)
  ].join('\n');
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, `${content}\n`, 'utf8');
}

function makePlaywrightDraft(url, visualMask) {
  const zones = visualMask.zones
    .map((zone) => `      { x: ${zone.x}, y: ${zone.y}, width: ${zone.width}, height: ${zone.height}, reason: '${String(zone.reason).replace(/'/g, "\\'")}' },`)
    .join('\n');

  return `import { test, expect } from '@playwright/test';

type IssueZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  reason: string;
};

async function renderVideoAnnotations(page: any, zones: IssueZone[]) {
  await page.evaluate((items) => {
    const existing = document.getElementById('qa-video-annotation-layer');
    if (existing) {
      existing.remove();
    }

    const layer = document.createElement('div');
    layer.id = 'qa-video-annotation-layer';
    layer.style.position = 'fixed';
    layer.style.inset = '0';
    layer.style.pointerEvents = 'none';
    layer.style.zIndex = '2147483646';

    items.forEach((zone, idx) => {
      const box = document.createElement('div');
      box.setAttribute('data-qa-video-annotation', 'box');
      box.style.position = 'fixed';
      box.style.left = Math.max(0, zone.x) + 'px';
      box.style.top = Math.max(0, zone.y) + 'px';
      box.style.width = Math.max(4, zone.width) + 'px';
      box.style.height = Math.max(4, zone.height) + 'px';
      box.style.border = '3px solid #e11d48';
      box.style.background = 'rgba(225, 29, 72, 0.12)';
      box.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.7) inset';
      box.style.animation = 'qaPulse 1.2s ease-in-out infinite';

      const label = document.createElement('div');
      label.textContent = 'Issue ' + (idx + 1) + ': ' + zone.reason;
      label.style.position = 'absolute';
      label.style.left = '0';
      label.style.top = '-26px';
      label.style.padding = '2px 8px';
      label.style.borderRadius = '4px';
      label.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      label.style.fontSize = '12px';
      label.style.color = '#fff';
      label.style.background = '#be123c';
      label.style.whiteSpace = 'nowrap';

      box.appendChild(label);
      layer.appendChild(box);
    });

    const legend = document.createElement('div');
    legend.setAttribute('data-qa-video-annotation', 'legend');
    legend.style.position = 'fixed';
    legend.style.right = '12px';
    legend.style.bottom = '12px';
    legend.style.maxWidth = '360px';
    legend.style.padding = '8px 10px';
    legend.style.borderRadius = '8px';
    legend.style.background = 'rgba(15, 23, 42, 0.86)';
    legend.style.color = '#e2e8f0';
    legend.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    legend.style.fontSize = '12px';
    legend.style.lineHeight = '1.45';
    legend.textContent = 'QA Video Annotations: ' + items.length + ' issue zone(s)';
    layer.appendChild(legend);

    document.body.appendChild(layer);

    const style = document.createElement('style');
    style.id = 'qa-video-annotation-style';
    style.textContent = '\n      @keyframes qaPulse {\n        0% { transform: scale(1); }\n        50% { transform: scale(1.02); }\n        100% { transform: scale(1); }\n      }\n    ';
    document.head.appendChild(style);
  }, zones);
}

async function clearVideoAnnotations(page: any) {
  await page.evaluate(() => {
    document.getElementById('qa-video-annotation-layer')?.remove();
    document.getElementById('qa-video-annotation-style')?.remove();
  });
}

test.describe('Login Page - Annotated QA checks', () => {
  test('layout and core flow checks', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.goto('${url}');
      await expect(page).toHaveURL(/login/);
      await expect(page.getByRole('heading', { name: /test login page/i })).toHaveCount(1);
    });

    await test.step('Validate login form controls', async () => {
      await expect(page.getByLabel('Username')).toHaveCount(1);
      await expect(page.getByLabel('Password')).toHaveCount(1);
      await expect(page.getByRole('button', { name: /login/i })).toHaveCount(1);
    });

    await test.step('Check for obvious off-screen clipping', async () => {
      const clipped = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll('a, button, input, [role="navigation"]')];
        return nodes.some((node) => {
          const rect = node.getBoundingClientRect();
          return rect.right < 0 || rect.left > window.innerWidth || rect.width <= 0 || rect.height <= 0;
        });
      });
      expect(clipped).toBeFalsy();
    });

    await test.step('Visual baseline with masks for unstable zones', async () => {
      const visualDiffMaskZones = [
${zones}
      ];

      await renderVideoAnnotations(page, visualDiffMaskZones);
      await expect(page.locator('[data-qa-video-annotation="box"]')).toHaveCount(visualDiffMaskZones.length);
      for (const zone of visualDiffMaskZones) {
        await page.evaluate((z) => {
          const targetY = Math.max(0, z.y - 120);
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        }, zone);
        await page.mouse.move(Math.max(8, zone.x + 8), Math.max(8, zone.y + 8));
        await page.waitForTimeout(700);
      }

      // TODO: Replace placeholder masks with stable locators for each zone.
      // Example: mask: [page.getByRole('navigation').first()]
      await expect(page).toHaveScreenshot('login-annotated-review.png');
      expect(visualDiffMaskZones.length).toBeGreaterThan(0);

      await page.waitForTimeout(800);

      await clearVideoAnnotations(page);
    });
  });
});
`;
}

function runCommand(command) {
  return execSync(command, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const url = args.url || 'https://practice.expandtesting.com/login';
  const cliDir = path.join(cwd, '.playwright-cli');
  const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
  const outDir = args.outDir || path.join(cwd, 'reports', 'qa-review', timestamp);

  if (args.goto === 'true') {
    runCommand(`playwright-cli goto ${url}`);
  }

  let annotationText = '';
  if (args['annotations-file']) {
    annotationText = fs.readFileSync(path.resolve(args['annotations-file']), 'utf8');
  } else if (args.annotations) {
    annotationText = args.annotations;
  } else if (args.annotate === 'true') {
    annotationText = runCommand('playwright-cli show --annotate');
  }

  const annotations = parseAnnotationText(annotationText);
  if (annotations.length === 0) {
    throw new Error(
      'No annotation metadata found. Provide --annotations-file, --annotations, or --annotate true and include lines in the expected format.'
    );
  }

  const screenshotPath = args.screenshot || latestFileByPrefix(cliDir, 'annotations-');
  const snapshotPath = args.snapshot || latestFileByPrefix(cliDir, 'page-');

  ensureDir(outDir);

  const bugReport = buildBugReport(annotations, url);
  const functionalCases = buildFunctionalTestCases(url);
  const edgeCases = buildEdgeCases();
  const accessibilityRisks = buildAccessibilityRisks(annotations);
  const playwrightSuggestions = buildPlaywrightSuggestions();
  const locators = buildLocators();
  const visualDiffMask = buildVisualDiffMask(annotations);
  const qaChecklist = buildQaChecklist();
  const jiraTickets = buildJiraTickets(bugReport);
  const mvpIdea = buildMvpIdea(url);

  writeJson(path.join(outDir, 'annotation-metadata.json'), annotations);
  writeJson(path.join(outDir, 'bug-report.json'), bugReport);
  writeJson(path.join(outDir, 'functional-test-cases.json'), functionalCases);
  writeJson(path.join(outDir, 'edge-cases.json'), edgeCases);
  writeJson(path.join(outDir, 'accessibility-risks.json'), accessibilityRisks);
  writeJson(path.join(outDir, 'playwright-automation-suggestions.json'), playwrightSuggestions);
  writeJson(path.join(outDir, 'playwright-locators.json'), locators);
  writeJson(path.join(outDir, 'visual-diff-mask.json'), visualDiffMask);
  writeJson(path.join(outDir, 'qa-checklist.json'), qaChecklist);
  writeJson(path.join(outDir, 'jira-tickets.json'), jiraTickets);
  writeJson(path.join(outDir, 'best-mvp-idea.json'), mvpIdea);

  const promptPacket = buildPromptPacket({
    url,
    screenshotPath,
    snapshotPath,
    annotations
  });
  writeText(path.join(outDir, 'ai-prompt.txt'), promptPacket);

  const draftSpec = makePlaywrightDraft(url, visualDiffMask);
  writeText(path.join(outDir, 'playwright-test-draft.spec.ts'), draftSpec);

  const summary = {
    url,
    generatedAt: new Date().toISOString(),
    outDir,
    screenshotPath,
    snapshotPath,
    files: fs.readdirSync(outDir).sort()
  };
  writeJson(path.join(outDir, 'run-summary.json'), summary);

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`qa-review-pipeline failed: ${error.message}\n`);
  process.exit(1);
}
