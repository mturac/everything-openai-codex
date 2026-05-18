/**
 * Tests for plugin manifests:
 *   - .codex-plugin/plugin.json (OpenAI Codex plugin)
 *   - .agents/plugins/marketplace.json (Codex marketplace discovery)
 *   - .mcp.json (MCP server config at plugin root)
 *
 * Enforces rules from:
 *   - .codex-plugin/PLUGIN_SCHEMA_NOTES.md (OpenAI Codex validator rules)
 *   - https://platform.openai.com/docs/codex/plugins (Codex official docs)
 *
 * Run with: node tests/run-all.js
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(repoRoot, 'package.json');
const packageLockPath = path.join(repoRoot, 'package-lock.json');
const rootAgentsPath = path.join(repoRoot, 'AGENTS.md');
const trAgentsPath = path.join(repoRoot, 'docs', 'tr', 'AGENTS.md');
const zhCnAgentsPath = path.join(repoRoot, 'docs', 'zh-CN', 'AGENTS.md');
const ptBrReadmePath = path.join(repoRoot, 'docs', 'pt-BR', 'README.md');
const trReadmePath = path.join(repoRoot, 'docs', 'tr', 'README.md');
const rootZhCnReadmePath = path.join(repoRoot, 'README.zh-CN.md');
const agentYamlPath = path.join(repoRoot, 'agent.yaml');
const versionFilePath = path.join(repoRoot, 'VERSION');
const zhCnReadmePath = path.join(repoRoot, 'docs', 'zh-CN', 'README.md');
const selectiveInstallArchitecturePath = path.join(repoRoot, 'docs', 'SELECTIVE-INSTALL-ARCHITECTURE.md');
const opencodePackageJsonPath = path.join(repoRoot, '.opencode', 'package.json');
const opencodePackageLockPath = path.join(repoRoot, '.opencode', 'package-lock.json');
const opencodeHooksPluginPath = path.join(repoRoot, '.opencode', 'plugins', 'ecc-hooks.ts');
const semverPattern = '[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    failed++;
  }
}

function loadJsonObject(filePath, label) {
  assert.ok(fs.existsSync(filePath), `Expected ${label} to exist`);

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    assert.fail(`Expected ${label} to contain valid JSON: ${error.message}`);
  }

  assert.ok(
    parsed && typeof parsed === 'object' && !Array.isArray(parsed),
    `Expected ${label} to contain a JSON object`,
  );

  return parsed;
}

function collectMarkdownFiles(rootPath) {
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const stat = fs.statSync(rootPath);
  if (stat.isFile()) {
    return rootPath.endsWith('.md') ? [rootPath] : [];
  }

  const files = [];
  for (const entry of fs.readdirSync(rootPath, { withFileTypes: true })) {
    const nextPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(nextPath));
    } else if (entry.isFile() && nextPath.endsWith('.md')) {
      files.push(nextPath);
    }
  }
  return files;
}

const rootPackage = loadJsonObject(packageJsonPath, 'package.json');
const packageLock = loadJsonObject(packageLockPath, 'package-lock.json');
const opencodePackageLock = loadJsonObject(opencodePackageLockPath, '.opencode/package-lock.json');
const expectedVersion = rootPackage.version;

test('package.json has version field', () => {
  assert.ok(expectedVersion, 'Expected package.json version field');
});

test('package-lock.json root version matches package.json', () => {
  assert.strictEqual(packageLock.version, expectedVersion);
  assert.ok(packageLock.packages && packageLock.packages[''], 'Expected package-lock root package entry');
  assert.strictEqual(packageLock.packages[''].version, expectedVersion);
});

test('AGENTS.md version line matches package.json', () => {
  const agentsSource = fs.readFileSync(rootAgentsPath, 'utf8');
  const match = agentsSource.match(new RegExp(`^\\*\\*Version:\\*\\* (${semverPattern})$`, 'm'));
  assert.ok(match, 'Expected AGENTS.md to declare a top-level version line');
  assert.strictEqual(match[1], expectedVersion);
});

test('docs/tr/AGENTS.md version line matches package.json', () => {
  const agentsSource = fs.readFileSync(trAgentsPath, 'utf8');
  const match = agentsSource.match(new RegExp(`^\\*\\*Sürüm:\\*\\* (${semverPattern})$`, 'm'));
  assert.ok(match, 'Expected docs/tr/AGENTS.md to declare a top-level version line');
  assert.strictEqual(match[1], expectedVersion);
});

test('docs/zh-CN/AGENTS.md version line matches package.json', () => {
  const agentsSource = fs.readFileSync(zhCnAgentsPath, 'utf8');
  const match = agentsSource.match(new RegExp(`^\\*\\*版本:\\*\\* (${semverPattern})$`, 'm'));
  assert.ok(match, 'Expected docs/zh-CN/AGENTS.md to declare a top-level version line');
  assert.strictEqual(match[1], expectedVersion);
});

test('agent.yaml version matches package.json', () => {
  const agentYamlSource = fs.readFileSync(agentYamlPath, 'utf8');
  const match = agentYamlSource.match(new RegExp(`^version:\\s*(${semverPattern})$`, 'm'));
  assert.ok(match, 'Expected agent.yaml to declare a top-level version field');
  assert.strictEqual(match[1], expectedVersion);
});

test('VERSION file matches package.json', () => {
  const versionFile = fs.readFileSync(versionFilePath, 'utf8').trim();
  assert.ok(versionFile, 'Expected VERSION file to be non-empty');
  assert.strictEqual(versionFile, expectedVersion);
});

test('docs/SELECTIVE-INSTALL-ARCHITECTURE.md repoVersion example matches package.json', () => {
  const source = fs.readFileSync(selectiveInstallArchitecturePath, 'utf8');
  const match = source.match(new RegExp(`"repoVersion":\\s*"(${semverPattern})"`));
  assert.ok(match, 'Expected docs/SELECTIVE-INSTALL-ARCHITECTURE.md to declare a repoVersion example');
  assert.strictEqual(match[1], expectedVersion);
});

test('.opencode/plugins/ecc-hooks.ts active plugin banner matches package.json', () => {
  const source = fs.readFileSync(opencodeHooksPluginPath, 'utf8');
  const match = source.match(new RegExp(`## Active Plugin: Everything OpenAI Codex v(${semverPattern})`));
  assert.ok(match, 'Expected .opencode/plugins/ecc-hooks.ts to declare an active plugin banner');
  assert.strictEqual(match[1], expectedVersion);
});

test('docs/pt-BR/README.md latest release heading matches package.json', () => {
  const source = fs.readFileSync(ptBrReadmePath, 'utf8');
  assert.ok(
    source.includes(`### v${expectedVersion} `),
    'Expected docs/pt-BR/README.md to advertise the current release heading',
  );
});

test('docs/tr/README.md latest release heading matches package.json', () => {
  const source = fs.readFileSync(trReadmePath, 'utf8');
  assert.ok(
    source.includes(`### v${expectedVersion} `),
    'Expected docs/tr/README.md to advertise the current release heading',
  );
});

test('README.zh-CN.md latest release heading matches package.json', () => {
  const source = fs.readFileSync(rootZhCnReadmePath, 'utf8');
  assert.ok(
    source.includes(`### v${expectedVersion} `),
    'Expected README.zh-CN.md to advertise the current release heading',
  );
});

test('docs/zh-CN/README.md latest release heading matches package.json', () => {
  const source = fs.readFileSync(zhCnReadmePath, 'utf8');
  assert.ok(
    source.includes(`### v${expectedVersion} `),
    'Expected docs/zh-CN/README.md to advertise the current release heading',
  );
});

// ── Codex plugin manifest ────────────────────────────────────────────────────
console.log('\n=== .codex-plugin/plugin.json ===\n');

const codexPluginPath = path.join(repoRoot, '.codex-plugin', 'plugin.json');

test('codex plugin.json exists', () => {
  assert.ok(fs.existsSync(codexPluginPath), 'Expected .codex-plugin/plugin.json to exist');
});

const codexPlugin = loadJsonObject(codexPluginPath, '.codex-plugin/plugin.json');

test('codex plugin.json has version field', () => {
  assert.ok(codexPlugin.version, 'Expected version field');
});

test('codex plugin.json version matches package.json', () => {
  assert.strictEqual(codexPlugin.version, expectedVersion);
});

test('codex plugin.json uses short plugin slug', () => {
  assert.strictEqual(codexPlugin.name, 'eoc');
});

test('codex plugin.json does NOT have agents field (unsupported by OpenAI Codex validator)', () => {
  assert.ok(
    !('agents' in codexPlugin),
    'agents field must NOT be declared — OpenAI Codex plugin validator rejects it',
  );
});

test('codex plugin.json skills is an array', () => {
  assert.ok(Array.isArray(codexPlugin.skills), 'Expected skills to be an array');
});

test('codex plugin.json commands is an array', () => {
  assert.ok(Array.isArray(codexPlugin.commands), 'Expected commands to be an array');
});

test('codex plugin.json disables bundled MCP servers for provider tool-name compatibility', () => {
  const legacyPluginName = 'everything-openai-codex';
  const reportedOverlongToolName = `mcp__plugin_${legacyPluginName}_github__create_pull_request_review`;

  assert.ok(
    reportedOverlongToolName.length > 64,
    'Expected the reported GitHub MCP tool name to exceed strict provider limits without the MCP opt-out',
  );
  assert.ok(
    Object.prototype.hasOwnProperty.call(codexPlugin, 'mcpServers'),
    'Expected mcpServers to be explicitly declared so OpenAI Codex does not auto-load root .mcp.json',
  );
  assert.deepStrictEqual(
    codexPlugin.mcpServers,
    {},
    'Codex plugin installs must not auto-bundle root MCP servers; document/manual MCP install remains supported',
  );
});

test('codex plugin.json does NOT have explicit hooks declaration', () => {
  assert.ok(
    !('hooks' in codexPlugin),
    'hooks field must NOT be declared — OpenAI Codex v2.1+ auto-loads hooks/hooks.json by convention',
  );
});

console.log('\n=== .agents/plugins/marketplace.json ===\n');

const agentsMarketplacePath = path.join(repoRoot, '.agents', 'plugins', 'marketplace.json');

test('marketplace.json exists at .agents/plugins/', () => {
  assert.ok(fs.existsSync(agentsMarketplacePath), 'Expected .agents/plugins/marketplace.json to exist');
});

const codexMarketplace = loadJsonObject(agentsMarketplacePath, '.agents/plugins/marketplace.json');

test('codex marketplace.json keeps only Codex-supported top-level keys', () => {
  const unsupportedTopLevelKeys = ['$schema', 'description'];
  for (const key of unsupportedTopLevelKeys) {
    assert.ok(
      !(key in codexMarketplace),
      `.codex-plugin/marketplace.json must not declare unsupported top-level key "${key}"`,
    );
  }
});

test('codex marketplace.json has plugins array with the published plugin entry', () => {
  assert.ok(Array.isArray(codexMarketplace.plugins) && codexMarketplace.plugins.length > 0, 'Expected plugins array');
  assert.strictEqual(codexMarketplace.name, 'eoc');
  assert.strictEqual(codexMarketplace.plugins[0].name, 'eoc');
});

test('codex marketplace.json plugin version matches package.json', () => {
  assert.strictEqual(codexMarketplace.plugins[0].version, expectedVersion);
});

// ── .mcp.json at plugin root ──────────────────────────────────────────────────
// Per official docs: keep .mcp.json at plugin root, NOT inside .codex-plugin/
console.log('\n=== .mcp.json (plugin root) ===\n');

const mcpJsonPath = path.join(repoRoot, '.mcp.json');

test('.mcp.json exists at plugin root (not inside .codex-plugin/)', () => {
  assert.ok(fs.existsSync(mcpJsonPath), 'Expected .mcp.json at repo root (plugin root)');
  assert.ok(
    !fs.existsSync(path.join(repoRoot, '.codex-plugin', '.mcp.json')),
    '.mcp.json must NOT be inside .codex-plugin/ — only plugin.json belongs there',
  );
});

const mcpConfig = loadJsonObject(mcpJsonPath, '.mcp.json');

test('.mcp.json has mcpServers object', () => {
  assert.ok(
    mcpConfig.mcpServers && typeof mcpConfig.mcpServers === 'object',
    'Expected mcpServers object',
  );
});

test('.mcp.json includes at least github, context7, and exa servers', () => {
  const servers = Object.keys(mcpConfig.mcpServers);
  assert.ok(servers.includes('github'), 'Expected github MCP server');
  assert.ok(servers.includes('context7'), 'Expected context7 MCP server');
  assert.ok(servers.includes('openaiDeveloperDocs'), 'Expected OpenAI Docs MCP server');
  assert.ok(servers.includes('exa'), 'Expected exa MCP server');
});

test('.mcp.json declares exa as an http MCP server', () => {
  assert.strictEqual(mcpConfig.mcpServers.exa.type, 'http', 'Expected exa MCP server to declare type=http');
  assert.strictEqual(mcpConfig.mcpServers.exa.url, 'https://mcp.exa.ai/mcp', 'Expected exa MCP server URL to remain unchanged');
  assert.strictEqual(mcpConfig.mcpServers.exa.tool_timeout_sec, 45, 'Expected exa MCP server to declare a tool timeout');
  assert.strictEqual(mcpConfig.mcpServers.openaiDeveloperDocs.url, 'https://developers.openai.com/mcp', 'Expected OpenAI Docs MCP URL');
  assert.deepStrictEqual(mcpConfig.mcpServers.openaiDeveloperDocs.enabled_tools, ['search', 'fetch'], 'Expected OpenAI Docs MCP tool allowlist');
});

// ── Codex marketplace file ────────────────────────────────────────────────────
// Per official docs: repo marketplace lives at $REPO_ROOT/.agents/plugins/marketplace.json
console.log('\n=== .agents/plugins/marketplace.json ===\n');

const marketplacePath = path.join(repoRoot, '.agents', 'plugins', 'marketplace.json');

test('marketplace.json exists at .agents/plugins/', () => {
  assert.ok(
    fs.existsSync(marketplacePath),
    'Expected .agents/plugins/marketplace.json for Codex repo marketplace discovery',
  );
});

const marketplace = loadJsonObject(marketplacePath, '.agents/plugins/marketplace.json');
const opencodePackage = loadJsonObject(opencodePackageJsonPath, '.opencode/package.json');

test('marketplace.json has name field', () => {
  assert.ok(marketplace.name, 'Expected name field');
});

test('marketplace.json uses short marketplace slug', () => {
  assert.strictEqual(marketplace.name, 'eoc');
});

test('marketplace.json has plugins array with at least one entry', () => {
  assert.ok(Array.isArray(marketplace.plugins) && marketplace.plugins.length > 0, 'Expected plugins array');
});

test('marketplace.json plugin entries have required fields', () => {
  for (const plugin of marketplace.plugins) {
    assert.ok(plugin.name, `Plugin entry missing name`);
    assert.ok(plugin.version, `Plugin "${plugin.name}" missing version`);
    assert.ok(plugin.source && plugin.source.source, `Plugin "${plugin.name}" missing source.source`);
    assert.ok(plugin.policy && plugin.policy.installation, `Plugin "${plugin.name}" missing policy.installation`);
    assert.ok(plugin.category, `Plugin "${plugin.name}" missing category`);
  }
});

test('marketplace.json plugin entry uses short plugin slug', () => {
  assert.strictEqual(marketplace.plugins[0].name, 'eoc');
});

test('marketplace.json plugin version matches package.json', () => {
  assert.strictEqual(marketplace.plugins[0].version, expectedVersion);
});

test('marketplace local plugin path resolves to the repo-root Codex bundle', () => {
  for (const plugin of marketplace.plugins) {
    if (!plugin.source || plugin.source.source !== 'local') {
      continue;
    }

    assert.ok(
      plugin.source.path.startsWith('./'),
      `Codex marketplace source.path must be ./-prefixed: ${plugin.source.path}`,
    );
    const resolvedRoot = path.resolve(repoRoot, plugin.source.path);
    assert.strictEqual(
      resolvedRoot,
      repoRoot,
      `Expected local marketplace path to resolve to repo root from marketplace root, got: ${plugin.source.path}`,
    );
    assert.ok(
      fs.existsSync(path.join(resolvedRoot, '.codex-plugin', 'plugin.json')),
      `Codex plugin manifest missing under resolved marketplace root: ${plugin.source.path}`,
    );
    assert.ok(
      fs.existsSync(path.join(resolvedRoot, '.mcp.json')),
      `Root MCP config missing under resolved marketplace root: ${plugin.source.path}`,
    );
  }
});

test('.opencode/package.json version matches package.json', () => {
  assert.strictEqual(opencodePackage.version, expectedVersion);
});

test('.opencode/package-lock.json root version matches package.json', () => {
  assert.strictEqual(opencodePackageLock.version, expectedVersion);
  assert.ok(opencodePackageLock.packages && opencodePackageLock.packages[''], 'Expected .opencode/package-lock root package entry');
  assert.strictEqual(opencodePackageLock.packages[''].version, expectedVersion);
});

test('README version row matches package.json', () => {
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
  const match = readme.match(new RegExp(`^\\| \\*\\*Version\\*\\* \\| Plugin \\| Plugin \\| Reference config \\| (${semverPattern}) \\|(?: Instruction layer \\|)?$`, 'm'));
  assert.ok(match, 'Expected README version summary row');
  assert.strictEqual(match[1], expectedVersion);
});

test('user-facing docs do not use overlong legacy marketplace install commands', () => {
  const markdownFiles = [
    path.join(repoRoot, 'README.md'),
    path.join(repoRoot, 'README.zh-CN.md'),
    path.join(repoRoot, 'skills', 'configure-ecc', 'SKILL.md'),
    ...collectMarkdownFiles(path.join(repoRoot, 'docs')),
  ].filter(filePath => !path.relative(repoRoot, filePath).startsWith(`docs${path.sep}drafts${path.sep}`));

  const offenders = [];
  for (const filePath of markdownFiles) {
    const source = fs.readFileSync(filePath, 'utf8');
    if (/\/plugin\s+(install|list)\s+everything-openai-codex(?:@everything-openai-codex)?\b/.test(source)) {
      offenders.push(path.relative(repoRoot, filePath));
    }
  }

  assert.deepStrictEqual(
    offenders,
    [],
    `Overlong legacy install commands must not appear in user-facing docs: ${offenders.join(', ')}`,
  );
});

test('user-facing docs do not use the legacy non-URL marketplace add form', () => {
  const markdownFiles = [
    path.join(repoRoot, 'README.md'),
    path.join(repoRoot, 'README.zh-CN.md'),
    ...collectMarkdownFiles(path.join(repoRoot, 'docs')),
  ];

  const offenders = [];
  for (const filePath of markdownFiles) {
    const source = fs.readFileSync(filePath, 'utf8');
    if (source.includes('/plugin marketplace add mehmet-turac/everything-openai-codex')) {
      offenders.push(path.relative(repoRoot, filePath));
    }
  }

  assert.deepStrictEqual(
    offenders,
    [],
    `Legacy non-URL marketplace add form must not appear in user-facing docs: ${offenders.join(', ')}`,
  );
});

test('.codex-plugin README uses current marketplace add flow', () => {
  const readme = fs.readFileSync(path.join(repoRoot, '.codex-plugin', 'README.md'), 'utf8');
  assert.ok(
    readme.includes('codex plugin marketplace add'),
    'Expected .codex-plugin README to document codex plugin marketplace add',
  );
  assert.ok(
    readme.includes('Official Plugin Directory publishing is coming soon'),
    'Expected .codex-plugin README to document current official directory status',
  );
  assert.ok(
    !/\bcodex plugin install\b/.test(readme),
    'codex plugin install is not a current Codex CLI command',
  );
});

test('docs/zh-CN/README.md version row matches package.json', () => {
  const readme = fs.readFileSync(zhCnReadmePath, 'utf8');
  const match = readme.match(new RegExp(`^\\| \\*\\*版本\\*\\* \\| 插件 \\| 插件 \\| 参考配置 \\| (${semverPattern}) \\|$`, 'm'));
  assert.ok(match, 'Expected docs/zh-CN/README.md version summary row');
  assert.strictEqual(match[1], expectedVersion);
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\nPassed: ${passed}`);
console.log(`Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
