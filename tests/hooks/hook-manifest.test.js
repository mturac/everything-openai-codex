/**
 * Tests for Codex hook manifest compatibility.
 *
 * Run with: node tests/hooks/hook-manifest.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');
const hooksPath = path.join(repoRoot, 'hooks', 'hooks.json');

let passed = 0;
let failed = 0;

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

function validateAsyncHooksHaveTimeout(hookManifest) {
  const violations = [];
  for (const [eventName, groups] of Object.entries(hookManifest.hooks || {})) {
    groups.forEach((group, groupIndex) => {
      for (const [hookIndex, hook] of (group.hooks || []).entries()) {
        if (hook.async === true && (!Number.isInteger(hook.timeout) || hook.timeout <= 0)) {
          violations.push(`${eventName}[${groupIndex}].hooks[${hookIndex}]`);
        }
      }
    });
  }

  if (violations.length > 0) {
    throw new Error(`Async Codex command hooks require a positive integer timeout at ${violations.join(', ')}`);
  }
}

if (
  test('hooks/hooks.json async handlers define explicit timeouts', () => {
    const manifest = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
    validateAsyncHooksHaveTimeout(manifest);
  })
)
  passed++;
else failed++;

if (
  test('hook validator rejects async:true handlers without timeouts', () => {
    assert.throws(
      () => validateAsyncHooksHaveTimeout({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo no', async: true }] }] } }),
      /Async Codex command hooks require/,
    );
  })
)
  passed++;
else failed++;

console.log(`\nPassed: ${passed}`);
console.log(`Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
