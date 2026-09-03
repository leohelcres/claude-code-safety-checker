#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { scanText } from "./rules.js";

const target = path.resolve(process.argv[2] || process.cwd());
const targetNames = new Set([
  "CLAUDE.md",
  "AGENTS.md",
  "GEMINI.md",
  "copilot-instructions.md"
]);
const allowedExtensions = new Set([".md", ".txt", ".json", ".yaml", ".yml"]);
const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage"
]);

function collectFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collectFiles(entryPath, files);
      continue;
    }

    const isAgentConfig =
      targetNames.has(entry.name) ||
      entryPath.includes(`${path.sep}.claude${path.sep}`);

    if (
      isAgentConfig &&
      allowedExtensions.has(path.extname(entry.name).toLowerCase())
    ) {
      files.push(entryPath);
    }
  }

  return files;
}

function colour(severity) {
  return (
    { high: "\u001b[31m", medium: "\u001b[33m", low: "\u001b[36m" }[
      severity
    ] || "\u001b[0m"
  );
}

if (!fs.existsSync(target)) {
  console.error(`Path not found: ${target}`);
  process.exit(2);
}

const files = fs.statSync(target).isDirectory()
  ? collectFiles(target)
  : [target];

console.log(
  `\nClaude Code Safety Checker\nScanning ${files.length} instruction/config file(s) in ${target}\n`
);

let total = 0;

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const findings = scanText(text);

  if (findings.length === 0) continue;

  total += findings.length;
  console.log(`\u001b[1m${path.relative(target, file) || path.basename(file)}\u001b[0m`);

  for (const finding of findings) {
    console.log(
      `  ${colour(finding.severity)}${finding.severity.toUpperCase()}\u001b[0m  line ${finding.line}  ${finding.title}`
    );
    console.log(`  ${finding.excerpt}`);
    console.log(`  → ${finding.advice}\n`);
  }
}

if (total === 0) {
  console.log(
    "No matching risks found. This is not a security guarantee—review agent instructions before trusting them.\n"
  );
} else {
  console.log(
    `Found ${total} issue(s). Review each one before running an agent with these instructions.\n`
  );
}
