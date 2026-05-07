import fs from "fs";
import path from "path";
import { evaluateSkillExecution } from "./skill-execution-checks.mjs";

function parseArgs(argv) {
  const args = { cases: "evals/cases.json" };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--cases" && argv[i + 1]) {
      args.cases = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function loadCases(rootDir, caseFile) {
  const fullPath = path.join(rootDir, caseFile);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Cases file not found: ${fullPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  if (!raw.cases || !Array.isArray(raw.cases)) {
    throw new Error("Invalid cases file: missing cases[]");
  }
  return raw.cases;
}

function writeArtifact(rootDir, caseId, artifact) {
  const artifactPath = path.join(rootDir, "evals", "artifacts", `${caseId}.json`);
  fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
  return artifactPath;
}

function main() {
  const rootDir = process.cwd();
  const args = parseArgs(process.argv);
  const transcriptPath = process.env.EVAL_TRANSCRIPT_FILE
    ? path.join(rootDir, process.env.EVAL_TRANSCRIPT_FILE)
    : "";
  const requireTranscript = process.env.EVAL_REQUIRE_TRANSCRIPT === "1";

  const cases = loadCases(rootDir, args.cases);
  const results = [];

  for (const c of cases) {
    const skillExecution = evaluateSkillExecution(c, {
      rootDir,
      transcriptPath,
      requireTranscript,
    });

    const artifact = {
      testCase: {
        id: c.id,
        name: c.name,
        feature: c.feature,
      },
      evaluation: {
        skillExecution,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        transcriptFile: process.env.EVAL_TRANSCRIPT_FILE || null,
        requireTranscript,
      },
    };

    const artifactPath = writeArtifact(rootDir, c.id, artifact);
    results.push({ id: c.id, score: skillExecution.score, pass: skillExecution.overall_pass, artifactPath });
  }

  const aggregate = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    averageScore:
      results.length === 0
        ? 0
        : Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length),
    results,
  };

  const aggregatePath = path.join(rootDir, "evals", "artifacts", "summary.json");
  fs.writeFileSync(aggregatePath, JSON.stringify(aggregate, null, 2));

  console.log(JSON.stringify(aggregate, null, 2));
}

main();
