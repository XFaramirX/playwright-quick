import fs from "fs";
import path from "path";

function readJsonSafe(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function readTextSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function fileExists(rootDir, relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function findCodeFilesForFeature(rootDir, feature) {
  const candidates = [
    path.join(rootDir, "e2e", "specs", feature),
    path.join(rootDir, "e2e", "pages", feature),
  ];

  const files = [];
  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".ts")) continue;
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function checkActionVerification(specText, pageText) {
  const assertionCount = countMatches(specText + "\n" + pageText, /await\s+expect\s*\(/g);
  return assertionCount > 0
    ? { pass: true, notes: `Found ${assertionCount} awaited assertions` }
    : { pass: false, notes: "No awaited assertions found for action verification" };
}

function checkForceClickDocumentation(pageText) {
  const forceClicks = [...pageText.matchAll(/click\s*\(\s*\{\s*force\s*:\s*true\s*\}\s*\)/g)];
  if (forceClicks.length === 0) {
    return { pass: true, notes: "No force clicks used" };
  }

  let documented = 0;
  for (const match of forceClicks) {
    const index = match.index || 0;
    const window = pageText.slice(Math.max(0, index - 300), index);
    if (/Note:|because|necessary|valid use case/i.test(window)) documented += 1;
  }

  if (documented === forceClicks.length) {
    return { pass: true, notes: `All ${forceClicks.length} force clicks are documented` };
  }

  return {
    pass: false,
    notes: `${documented}/${forceClicks.length} force clicks are documented with rationale`,
  };
}

function checkAccessibleLocators(specText, pageText) {
  const combined = specText + "\n" + pageText;
  const accessibleCount = countMatches(
    combined,
    /getByRole\(|getByLabel\(|getByText\(|getByPlaceholder\(/g,
  );
  return accessibleCount > 0
    ? { pass: true, notes: `Found ${accessibleCount} accessible locators` }
    : { pass: false, notes: "No accessible locators found" };
}

function checkNoHardWaits(specText, pageText) {
  const hardWaitCount = countMatches(specText + "\n" + pageText, /waitForTimeout\s*\(/g);
  return hardWaitCount === 0
    ? { pass: true, notes: "No hard waits found" }
    : { pass: false, notes: `Found ${hardWaitCount} waitForTimeout usage(s)` };
}

function checkConstantsPolicy(caseConfig, expectedFiles, allCodeText) {
  if (!caseConfig.requiresConstants) {
    return { pass: true, notes: "Constants file is optional for this case" };
  }

  const hasConstants = expectedFiles.some((f) => f.endsWith("constants.ts"));
  if (!hasConstants) {
    return { pass: false, notes: "Missing required constants.ts file" };
  }

  const hasConstantsExport = /export\s+const\s+/m.test(allCodeText);
  return hasConstantsExport
    ? { pass: true, notes: "Constants file found and exports constants" }
    : { pass: true, notes: "Constants file found" };
}

function checkOutcomeTaskComplete(missingFiles) {
  return missingFiles.length === 0
    ? { pass: true, notes: "All expected files are present" }
    : { pass: false, notes: `Missing expected files: ${missingFiles.join(", ")}` };
}

function checkOutcomeTestsExecuted(stateJson, stateKeyIncludes) {
  const keys = Object.keys(stateJson || {});
  const matched = keys.filter((k) => k.includes(stateKeyIncludes));
  const executed = matched.some((k) => Number(stateJson[k]) > 0);

  if (matched.length === 0) {
    return { pass: false, notes: `No state entries found for key fragment: ${stateKeyIncludes}` };
  }

  return executed
    ? { pass: true, notes: `Found ${matched.length} test run entries in state.json` }
    : { pass: false, notes: "State entries found but all durations are 0" };
}

function checkProcessRequirementsAnalyzed(transcriptText, requireTranscript) {
  if (!transcriptText) {
    if (requireTranscript) {
      return { pass: false, notes: "No transcript evidence provided (set EVAL_TRANSCRIPT_FILE)" };
    }
    return { pass: true, notes: "Skipped: no transcript evidence provided" };
  }

  const markers = [
    /analy[sz]e requirements?/i,
    /test patterns?/i,
    /page object/i,
    /constants (needs|policy|management)/i,
  ];
  const score = markers.reduce((acc, re) => acc + (re.test(transcriptText) ? 1 : 0), 0);

  return score >= 2
    ? { pass: true, notes: `Found ${score}/4 requirement-analysis markers` }
    : { pass: false, notes: `Only ${score}/4 requirement-analysis markers found` };
}

function checkProcessPipelineUsed(transcriptText, requireTranscript) {
  if (!transcriptText) {
    if (requireTranscript) {
      return { pass: false, notes: "No transcript evidence provided (set EVAL_TRANSCRIPT_FILE)" };
    }
    return { pass: true, notes: "Skipped: no transcript evidence provided" };
  }

  const idxAnalyze = transcriptText.search(/analy[sz]e requirements?/i);
  const idxGenerate = transcriptText.search(/generate files?|create files?|implement/i);
  const idxQuality = transcriptText.search(/quality assurance|A\+|checklist|validate|verification/i);

  const ordered = idxAnalyze >= 0 && idxGenerate > idxAnalyze && idxQuality > idxGenerate;
  return ordered
    ? { pass: true, notes: "Detected Analyze -> Generate -> Quality flow in order" }
    : { pass: false, notes: "Could not confirm ordered pipeline flow from transcript" };
}

function checkEfficiencyNoFallbackThrashing(transcriptText) {
  if (!transcriptText) {
    return { pass: true, notes: "No transcript provided; no thrashing evidence found" };
  }

  const fallbackCount = countMatches(transcriptText, /fallback|retry|try again|attempt\s+\d+/gi);
  return fallbackCount <= 8
    ? { pass: true, notes: `Fallback/retry markers within limit (${fallbackCount})` }
    : { pass: false, notes: `Possible fallback thrashing detected (${fallbackCount} markers)` };
}

function checkSchemaAndConventions(specText) {
  const hasFixtureImport = /from\s+['\"]\.\.\/\.\.\/fixtures\/base['\"]/m.test(specText);
  const hasDescribe = /test\.describe\s*\(/m.test(specText);
  if (hasFixtureImport && hasDescribe) {
    return { pass: true, notes: "Spec follows fixture import and describe conventions" };
  }
  return { pass: false, notes: "Spec is missing fixture import or test.describe convention" };
}

function checkNoPlaceholders(specText, pageText) {
  const combined = `${specText}\n${pageText}`;
  const placeholderRegex = /TODO|FIXME|<feature>|your-feature|TBD|lorem ipsum/i;
  const hasPlaceholder = placeholderRegex.test(combined);
  return hasPlaceholder
    ? { pass: false, notes: "Placeholder text found in generated files" }
    : { pass: true, notes: "No placeholder text found" };
}

export function evaluateSkillExecution(caseConfig, options) {
  const rootDir = options.rootDir;
  const statePath = path.join(rootDir, "state.json");
  const transcriptPath = options.transcriptPath || "";

  const missingFiles = caseConfig.expectedFiles.filter((rel) => !fileExists(rootDir, rel));
  const expectedFiles = caseConfig.expectedFiles.filter((rel) => fileExists(rootDir, rel));

  const specText = readTextSafe(path.join(rootDir, caseConfig.specPath));
  const featureFiles = findCodeFilesForFeature(rootDir, caseConfig.feature);
  const pageTexts = featureFiles
    .filter((f) => f.includes(path.sep + "pages" + path.sep))
    .map((f) => readTextSafe(f))
    .join("\n\n");
  const allCodeText = [specText, ...featureFiles.map((f) => readTextSafe(f))].join("\n\n");

  const stateJson = readJsonSafe(statePath, {});
  const transcriptText = transcriptPath ? readTextSafe(transcriptPath) : "";

  const c1 = checkOutcomeTaskComplete(missingFiles);
  const c2 = checkOutcomeTestsExecuted(stateJson, caseConfig.stateKeyIncludes);
  const c3 = checkProcessRequirementsAnalyzed(transcriptText, Boolean(options.requireTranscript));
  const c4 = checkProcessPipelineUsed(transcriptText, Boolean(options.requireTranscript));
  const c5 = checkNoHardWaits(specText, pageTexts);
  const c6 = checkActionVerification(specText, pageTexts);
  const c7 = checkSchemaAndConventions(specText);
  const c8 = checkNoPlaceholders(specText, pageTexts);
  const c9 = checkAccessibleLocators(specText, pageTexts);
  const c10 = checkConstantsPolicy(caseConfig, expectedFiles, allCodeText);
  const c11 = checkForceClickDocumentation(pageTexts);
  const c12 = checkEfficiencyNoFallbackThrashing(transcriptText);

  const checks = [
    { id: "outcome_task_complete", category: "Outcome", ...c1 },
    { id: "outcome_tests_execute", category: "Outcome", ...c2 },
    { id: "process_requirements_analyzed", category: "Process", ...c3 },
    { id: "process_skill_pipeline_used", category: "Process", ...c4 },
    { id: "style_zero_hard_waits", category: "Style", ...c5 },
    { id: "style_action_verification", category: "Style", ...c6 },
    { id: "style_schema_and_conventions", category: "Style", ...c7 },
    { id: "style_no_placeholders", category: "Style", ...c8 },
    { id: "style_accessible_locators", category: "Style", ...c9 },
    { id: "style_constants_policy", category: "Style", ...c10 },
    { id: "style_force_click_documented", category: "Style", ...c11 },
    { id: "efficiency_no_fallback_thrashing", category: "Efficiency", ...c12 },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);

  return {
    score,
    overall_pass: checks.every((c) => c.pass),
    checks,
    summary: {
      passed,
      total: checks.length,
      failed: checks.length - passed,
    },
  };
}
