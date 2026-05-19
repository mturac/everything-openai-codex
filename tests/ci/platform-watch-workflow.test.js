#!/usr/bin/env node
/**
 * Validate the daily platform watch workflow contract.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const WORKFLOW_PATH = path.join(
  __dirname,
  '..',
  '..',
  '.github',
  'workflows',
  'platform-watch.yml',
);
const MAINTENANCE_PATH = path.join(
  __dirname,
  '..',
  '..',
  '.github',
  'workflows',
  'maintenance.yml',
);

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function run() {
  console.log('\n=== Testing daily platform watch workflow ===\n');

  const source = fs.readFileSync(WORKFLOW_PATH, 'utf8');
  const maintenance = fs.readFileSync(MAINTENANCE_PATH, 'utf8');
  let passed = 0;
  let failed = 0;

  if (test('runs daily and supports manual dispatch', () => {
    assert.match(source, /name: Daily Platform Watch/);
    assert.match(source, /schedule:\r?\n\s+- cron: '23 7 \* \* \*'/);
    assert.match(source, /workflow_dispatch:/);
  })) passed++; else failed++;

  if (test('uses read-only token scopes and non-persisting checkout credentials', () => {
    assert.match(source, /permissions:\r?\n\s+contents: read\r?\n\s+discussions: read\r?\n\s+issues: read\r?\n\s+pull-requests: read/);
    assert.doesNotMatch(source, /^\s+[A-Za-z-]+:\s*write\b/m);
    assert.match(source, /uses: actions\/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd/);
    assert.match(source, /persist-credentials: false/);
    assert.doesNotMatch(source, /id-token:\s*write/);
    assert.doesNotMatch(source, /actions\/cache@/);
  })) passed++; else failed++;

  if (test('generates evidence artifacts without public posting actions', () => {
    assert.match(source, /npm ci --ignore-scripts/);
    assert.match(source, /node scripts\/platform-audit\.js --json --use-env-github-token --repo mturac\/everything-openai-codex/);
    assert.match(source, /node scripts\/discussion-audit\.js --json --use-env-github-token --repo mturac\/everything-openai-codex/);
    assert.match(source, /node scripts\/operator-readiness-dashboard\.js --json --use-env-github-token --repo mturac\/everything-openai-codex/);
    assert.match(source, /uses: actions\/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a/);
    assert.match(source, /name: daily-platform-watch/);
    assert.doesNotMatch(source, /gh\s+(?:pr|issue)\s+(?:comment|create|close|edit)/);
    assert.doesNotMatch(source, /actions\/stale@/);
  })) passed++; else failed++;

  if (test('fails only through readiness gates and disables automatic stale comments', () => {
    assert.match(source, /platform audit needs attention/);
    assert.match(source, /discussion audit needs attention/);
    assert.match(source, /node scripts\/ci\/validate-workflow-security\.js/);
    assert.doesNotMatch(maintenance, /actions\/stale@/);
    assert.doesNotMatch(maintenance, /^\s+(?:issues|pull-requests):\s*write\b/m);
  })) passed++; else failed++;

  console.log(`\nPassed: ${passed}`);
  console.log(`Failed: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

run();
