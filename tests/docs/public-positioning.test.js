'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    failed++;
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

console.log('\n=== Testing public positioning ===\n');

const publicReadmes = [
  'README.md',
  'README.zh-CN.md',
  'docs/tr/README.md',
  'docs/zh-CN/README.md',
  'docs/vi-VN/README.md',
];

for (const relativePath of publicReadmes) {
  test(`${relativePath} avoids fixed vanity metrics and award claims`, () => {
    const source = read(relativePath);
    assert.ok(!/\b\d+K\+\s+(stars|forks|sao|yıldız)/i.test(source));
    assert.ok(!/OpenAI\s*Hackathon\s*Winner|OpenAI黑客松获胜者|OpenAI Hackathon Kazananı/i.test(source));
  });
}

test('repo assessment describes the current Codex rc.1 project', () => {
  const source = read('REPO-ASSESSMENT.md');
  assert.ok(source.includes('Everything OpenAI Codex (ecc)'));
  assert.ok(source.includes('2.0.0-rc.1'));
  assert.ok(source.includes('ecc@ecc'));
  assert.ok(!source.includes('fork of'));
  assert.ok(!source.includes('1.9.0 (current)'));
});

test('release workflows advertise the short Codex plugin identifier', () => {
  for (const relativePath of [
    '.github/workflows/release.yml',
    '.github/workflows/reusable-release.yml',
  ]) {
    const source = read(relativePath);
    assert.ok(/Codex marketplace\/plugin identifier: \\?`ecc@ecc\\?`/.test(source));
    assert.ok(!source.includes('everything-openai-codex@everything-openai-codex'));
  }
});

if (failed > 0) {
  console.log(`\nFailed: ${failed}`);
  process.exit(1);
}

console.log(`\nPassed: ${passed}`);
