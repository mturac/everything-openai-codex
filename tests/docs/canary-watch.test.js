const assert = require('assert');
const fs = require('fs');
const path = require('path');

const SKILL_PATH = path.join(__dirname, '..', '..', 'skills', 'canary-watch', 'SKILL.md');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing canary-watch skill docs ===\n');

  let passed = 0;
  let failed = 0;
  const body = fs.readFileSync(SKILL_PATH, 'utf8');

  if (test('description monitoring claims are backed by watch sections', () => {
    for (const phrase of [
      'HTTP endpoints',
      'SSE streams',
      'static assets',
      'console errors',
      'performance regressions',
      'PR queue health',
      'maintainer feedback',
      'listing-review blockers',
    ]) {
      assert.ok(body.toLowerCase().includes(phrase.toLowerCase()), `missing phrase: ${phrase}`);
    }
    assert.ok(body.includes('Static Assets'), 'watch list should include static assets');
    assert.ok(body.includes('SSE Streams'), 'watch list should include SSE streams');
    assert.ok(body.includes('SSE endpoint cannot connect'), 'critical thresholds should cover SSE failures');
  })) passed++; else failed++;

  if (test('OSS PR queue mode has anti-spam and fit gates', () => {
    for (const phrase of [
      'Responsibility Contract',
      'Rule Precedence',
      'Listing Target Decision Context',
      'Technical Risk Contract',
      'Conflict behavior',
      'do not decide silently',
      'OSS PR queue mode',
      'do not comment',
      'Do not post "any update?" comments',
      'zero public-action carve-outs',
      'separate user-approved task',
      'Closed reject',
      'Silent close',
      'Positioning Gate',
      'target market or community',
      'no paid placement',
      'reputation-safe submission',
      'proven/community-adopted skills',
      'execution model',
      'gh pr view <number>',
      'reread PR body after edit',
      'PromptGuard for prompt-like files',
    ]) {
      assert.ok(body.includes(phrase), `missing PR queue contract phrase: ${phrase}`);
    }
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
