#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..');
const DEST = process.cwd();

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

function log(symbol, message) {
  console.log(`  ${symbol} ${message}`);
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  const existed = existsSync(dest);
  copyFileSync(src, dest);
  const label = dest.replace(DEST + '\\', '').replace(DEST + '/', '');
  log(existed ? `${YELLOW}↺${RESET}` : `${GREEN}+${RESET}`, label);
}

function copyDir(srcDir, destDir) {
  ensureDir(destDir);
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function run() {
  console.log();
  console.log(`${BOLD}${CYAN}copilot-agents${RESET} — installing VS Code Copilot configuration`);
  console.log(`  Target: ${DEST}`);
  console.log();

  const githubDir = join(DEST, '.github');
  ensureDir(githubDir);

  // 1. AGENTS.md → project root (universal AI agent instructions, read by any AI tool)
  copyFile(join(SRC, 'AGENTS.md'), join(DEST, 'AGENTS.md'));

  // 2. .github/copilot-instructions.md (VS Code Copilot specific)
  copyFile(
    join(SRC, '.github', 'copilot-instructions.md'),
    join(githubDir, 'copilot-instructions.md')
  );

  // 3. Agents — single source and single target:
  //    .github/agents/*.md       → GitHub Copilot Chat @agent-name
  const srcAgentsDir = join(SRC, '.github', 'agents');
  const destAgentsDir = join(githubDir, 'agents');
  ensureDir(destAgentsDir);
  for (const entry of readdirSync(srcAgentsDir)) {
    // Only copy canonical source files and skip generated *.agent.md artifacts.
    if (entry.endsWith('.md') && !entry.endsWith('.agent.md')) {
      copyFile(join(srcAgentsDir, entry), join(destAgentsDir, entry));
    }
  }

  // 4. .github/skills/ → .github/skills/ (on-demand knowledge files)
  copyDir(join(SRC, '.github', 'skills'), join(githubDir, 'skills'));

  // 5. INDEX.md → .github/copilot-agents.md (reference)
  copyFile(join(SRC, 'INDEX.md'), join(githubDir, 'copilot-agents.md'));

  console.log();
  console.log(`${GREEN}${BOLD}Done.${RESET} Copilot configuration installed:`);
  console.log();
  console.log(`  ${BOLD}GitHub Copilot Chat${RESET} — call via @agent-name:`);
  console.log(`    ${BOLD}@feedback${RESET}      → main orchestrator (MCP feedback loop)`);
  console.log(`    ${BOLD}@architect${RESET}     → design patterns, SOLID, refactoring`);
  console.log(`    ${BOLD}@guardian${RESET}      → security audit + code evaluation`);
  console.log(`    ${BOLD}@devops${RESET}        → CI/CD, containers, infrastructure`);
  console.log(`    ${BOLD}@gcp-ml-expert${RESET} → TensorFlow/Keras/PyTorch + Vertex AI`);
  console.log();
  console.log(`  Agents (chat):   ${join(githubDir, 'agents')}`);
  console.log(`  Skills:          ${join(githubDir, 'skills')}`);
  console.log(`  Universal:       ${join(DEST, 'AGENTS.md')}`);
  console.log(`${YELLOW}Legend:${RESET} ${GREEN}+${RESET} new file  ${YELLOW}↺${RESET} updated`);
  console.log();
}

run();

