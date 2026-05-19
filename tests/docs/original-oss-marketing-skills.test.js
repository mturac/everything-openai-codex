const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

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
  console.log('\n=== Testing original OSS marketing skills ===\n');

  let passed = 0;
  let failed = 0;
  const proof = read('skills/proof-led-oss-marketing/SKILL.md');
  const rejection = read('skills/rejection-recovery-loop/SKILL.md');
  const modules = read('manifests/install-modules.json');
  const packageJson = read('package.json');

  if (test('proof-led marketing requires evidence before distribution', () => {
    for (const phrase of [
      'Proof-Led OSS Marketing',
      'Evidence Ladder',
      'L0 claims stay labeled L0',
      'Proof Packet',
      'Future paid features appear only when they are live and relevant',
      'public comments, form submissions, and listing PR creation',
      'watch',
      'skip',
    ]) {
      assert.ok(proof.includes(phrase), `missing proof-led phrase: ${phrase}`);
    }
  })) passed++; else failed++;

  if (test('rejection recovery turns rejection into fixes without spam', () => {
    for (const phrase of [
      'Rejection Recovery Loop',
      'arguing with maintainers or moderators',
      'reposting the same submission',
      'Silent close',
      'fix and respond',
      'resubmit later',
      'skip permanently',
      'Response Rules',
    ]) {
      assert.ok(rejection.includes(phrase), `missing rejection phrase: ${phrase}`);
    }
  })) passed++; else failed++;

  if (test('new skills are included in install and publish surfaces', () => {
    for (const skill of [
      'skills/proof-led-oss-marketing',
      'skills/rejection-recovery-loop',
    ]) {
      assert.ok(modules.includes(`"${skill}"`), `${skill} missing from install modules`);
      assert.ok(packageJson.includes(`"${skill}/"`), `${skill} missing from package files`);
    }
  })) passed++; else failed++;

  console.log(`\nPassed: ${passed}`);
  console.log(`Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
