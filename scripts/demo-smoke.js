#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/demo-smoke.js [--json]

Run the safe local proof path for public demos:
- source install dry-run
- catalog keyword search
- doctor empty-state check
- status store check
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    json: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function runStep(step, script, args, context, validate) {
  const result = spawnSync('node', [path.join(REPO_ROOT, script), ...args], {
    cwd: context.projectRoot,
    env: {
      ...process.env,
      HOME: context.homeDir,
      USERPROFILE: context.homeDir,
    },
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 30000,
  });

  const output = {
    step,
    command: `node ${script} ${args.join(' ')}`.trim(),
    status: result.status === 0 ? 'pass' : 'fail',
    code: result.status,
    summary: '',
  };

  if (result.error) {
    output.status = 'fail';
    output.summary = result.error.message;
    return output;
  }

  if (result.status !== 0) {
    output.summary = (result.stderr || result.stdout || '').trim().split('\n').slice(0, 3).join(' ');
    return output;
  }

  try {
    output.summary = validate(result.stdout || '');
  } catch (error) {
    output.status = 'fail';
    output.summary = error.message;
  }

  return output;
}

function assertJson(stdout, label) {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${label} did not emit valid JSON: ${error.message}`);
  }
}

function runSmoke() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'eoc-demo-smoke-'));
  const context = {
    homeDir: path.join(tempRoot, 'home'),
    projectRoot: path.join(tempRoot, 'project'),
    dbPath: path.join(tempRoot, 'status.db'),
  };
  fs.mkdirSync(context.homeDir, { recursive: true });
  fs.mkdirSync(context.projectRoot, { recursive: true });

  try {
    const checks = [
      runStep(
        'source install dry-run',
        'scripts/install-apply.js',
        ['--profile', 'minimal', '--target', 'codex', '--dry-run', '--json'],
        context,
        stdout => {
          const parsed = assertJson(stdout, 'install dry-run');
          const operations = parsed.plan && Array.isArray(parsed.plan.operations)
            ? parsed.plan.operations
            : [];
          if (!parsed.dryRun || operations.length === 0) {
            throw new Error('install dry-run did not return planned operations');
          }
          return `${operations.length} planned operations`;
        }
      ),
      runStep(
        'catalog keyword search',
        'scripts/catalog.js',
        ['search', 'security', '--json'],
        context,
        stdout => {
          const parsed = assertJson(stdout, 'catalog search');
          if (!Array.isArray(parsed.results) || !parsed.results.some(entry => entry.id === 'capability:security')) {
            throw new Error('catalog search did not return capability:security');
          }
          return `${parsed.results.length} catalog matches`;
        }
      ),
      runStep(
        'doctor empty-state check',
        'scripts/doctor.js',
        ['--target', 'codex'],
        context,
        stdout => {
          if (!stdout.includes('No ecc install-state files found')) {
            throw new Error('doctor did not report the clean empty-state');
          }
          return 'no install-state found, as expected in isolated demo home';
        }
      ),
      runStep(
        'status store check',
        'scripts/status.js',
        ['--db', context.dbPath, '--json'],
        context,
        stdout => {
          const parsed = assertJson(stdout, 'status');
          if (!parsed.readiness || parsed.readiness.status !== 'ok') {
            throw new Error('status readiness was not ok for isolated demo store');
          }
          return 'isolated status store readiness ok';
        }
      ),
    ];

    const failed = checks.filter(check => check.status !== 'pass');
    return {
      ok: failed.length === 0,
      generatedAt: new Date().toISOString(),
      checks,
    };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function printHuman(report) {
  console.log('EOC demo smoke:\n');
  for (const check of report.checks) {
    console.log(`- ${check.status.toUpperCase()} ${check.step}`);
    console.log(`  ${check.command}`);
    console.log(`  ${check.summary}`);
  }
  console.log(`\nSummary: ${report.ok ? 'PASS' : 'FAIL'}`);
}

function main() {
  try {
    const options = parseArgs(process.argv);
    if (options.help) {
      showHelp(0);
    }

    const report = runSmoke();
    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printHuman(report);
    }
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  runSmoke,
};
