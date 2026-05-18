/**
 * Tests for scripts/lib/cost-estimate.js
 *
 * Run with: node tests/lib/cost-estimate.test.js
 */

const assert = require('assert');

const { estimateCost, RATE_TABLE } = require('../../scripts/lib/cost-estimate');

// Test helper
function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing cost-estimate.js ===\n');

  let passed = 0;
  let failed = 0;

  // RATE_TABLE structure
  console.log('RATE_TABLE:');

  if (
    test('RATE_TABLE has fast, standard, deep keys', () => {
      assert.ok(RATE_TABLE.fast, 'Missing fast');
      assert.ok(RATE_TABLE.standard, 'Missing standard');
      assert.ok(RATE_TABLE.deep, 'Missing deep');
      assert.strictEqual(typeof RATE_TABLE.fast.in, 'number');
      assert.strictEqual(typeof RATE_TABLE.fast.out, 'number');
      assert.strictEqual(typeof RATE_TABLE.standard.in, 'number');
      assert.strictEqual(typeof RATE_TABLE.standard.out, 'number');
      assert.strictEqual(typeof RATE_TABLE.deep.in, 'number');
      assert.strictEqual(typeof RATE_TABLE.deep.out, 'number');
    })
  )
    passed++;
  else failed++;

  // estimateCost tests
  console.log('\nestimateCost:');

  if (
    test('deep 1M/1M tokens returns 90', () => {
      const cost = estimateCost('deep', 1_000_000, 1_000_000);
      assert.strictEqual(cost, 90);
    })
  )
    passed++;
  else failed++;

  if (
    test('standard 1M/1M tokens returns 18', () => {
      const cost = estimateCost('standard', 1_000_000, 1_000_000);
      assert.strictEqual(cost, 18);
    })
  )
    passed++;
  else failed++;

  if (
    test('fast 1M/1M tokens returns 4.8', () => {
      const cost = estimateCost('fast', 1_000_000, 1_000_000);
      assert.strictEqual(cost, 4.8);
    })
  )
    passed++;
  else failed++;

  if (
    test('null model with 0 tokens returns 0', () => {
      const cost = estimateCost(null, 0, 0);
      assert.strictEqual(cost, 0);
    })
  )
    passed++;
  else failed++;

  if (
    test('full model name codex-deep-4-6 uses deep rates', () => {
      const cost = estimateCost('codex-deep-4-6', 500, 200);
      // (500 / 1_000_000) * 15 + (200 / 1_000_000) * 75 = 0.0075 + 0.015 = 0.0225
      const expected = Math.round(0.0225 * 1e6) / 1e6;
      assert.strictEqual(cost, expected);
    })
  )
    passed++;
  else failed++;

  if (
    test('unknown model falls back to standard rates', () => {
      const cost = estimateCost('unknown-model', 1_000_000, 1_000_000);
      assert.strictEqual(cost, 18);
    })
  )
    passed++;
  else failed++;

  // Summary
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
}

const { failed } = runTests();
process.exit(failed > 0 ? 1 : 0);
