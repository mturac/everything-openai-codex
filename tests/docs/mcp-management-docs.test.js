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
    console.log(`  \u2713 ${name}`);
    passed++;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    failed++;
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

console.log('\n=== Testing MCP management docs ===\n');

test('token optimization guide separates Codex MCP disables from ecc config filters', () => {
  const source = read('docs/token-optimization.md');

  assert.ok(
    source.includes('Use `/mcp` to disable OpenAI Codex MCP servers'),
    'Token guide should direct OpenAI Codex users to /mcp for runtime MCP disables'
  );
  assert.ok(
    source.includes('OpenAI Codex persists those runtime disables in `~/.codex.json`'),
    'Token guide should name ~/.codex.json as the observed runtime disable store'
  );
  assert.ok(
    source.includes('`ecc_DISABLED_MCPS` only affects ecc-generated MCP config output'),
    'Token guide should scope ecc_DISABLED_MCPS to config generation'
  );
  assert.ok(
    !source.includes('Use `disabledMcpServers` in project config to disable servers per-project'),
    'Token guide should not tell users that project settings disable Codex runtime MCP servers'
  );
});

test('README MCP guidance avoids settings.json disable instructions', () => {
  const source = read('README.md');

  assert.ok(
    source.includes('Use `/mcp` for OpenAI Codex runtime disables; OpenAI Codex persists those choices in `~/.codex.json`.'),
    'README should route runtime MCP disables through /mcp and ~/.codex.json'
  );
  assert.ok(
    source.includes('`ecc_DISABLED_MCPS` is an EOC install/sync filter, not a live OpenAI Codex toggle.'),
    'README should explain ecc_DISABLED_MCPS scope'
  );
  assert.ok(
    !source.includes('// In your project\'s .codex/settings.json\n{\n  "disabledMcpServers"'),
    'README should not show disabledMcpServers under .codex/settings.json'
  );
  assert.ok(
    !source.includes('Use `disabledMcpServers` in project config to disable unused ones'),
    'README quick reference should not repeat stale project-config guidance'
  );
});

if (failed > 0) {
  console.log(`\nFailed: ${failed}`);
  process.exit(1);
}

console.log(`\nPassed: ${passed}`);
