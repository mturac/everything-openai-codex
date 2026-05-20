/**
 * Tests for scripts/demo-smoke.js
 */

const assert = require('assert');
const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'demo-smoke.js');

function run(args = []) {
  try {
    const stdout = execFileSync('node', [SCRIPT, ...args], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000,
    });
    return { code: 0, stdout, stderr: '' };
  } catch (error) {
    return {
      code: error.status || 1,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    };
  }
}

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
  console.log('\n=== Testing demo-smoke.js ===\n');

  let passed = 0;
  let failed = 0;

  if (test('shows help', () => {
    const result = run(['--help']);
    assert.strictEqual(result.code, 0);
    assert.ok(result.stdout.includes('Run the safe local proof path'));
  })) passed++; else failed++;

  if (test('runs the isolated demo smoke path as JSON', () => {
    const result = run(['--json']);
    assert.strictEqual(result.code, 0, result.stderr);
    const parsed = JSON.parse(result.stdout);
    assert.strictEqual(parsed.ok, true);
    assert.strictEqual(parsed.checks.length, 4);
    assert.ok(parsed.checks.every(check => check.status === 'pass'));
    assert.ok(parsed.checks.some(check => check.step === 'catalog keyword search'));
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
