#!/usr/bin/env node

const os = require('os');
const { buildDoctorReport } = require('./lib/install-lifecycle');
const { SUPPORTED_INSTALL_TARGETS } = require('./lib/install-manifests');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/doctor.js [--target <${SUPPORTED_INSTALL_TARGETS.join('|')}>] [--json]

Diagnose drift and missing managed files for ecc install-state in the current context.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    targets: [],
    json: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--target') {
      parsed.targets.push(args[index + 1] || null);
      index += 1;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function statusLabel(status) {
  if (status === 'ok') {
    return 'OK';
  }

  if (status === 'warning') {
    return 'WARNING';
  }

  if (status === 'error') {
    return 'ERROR';
  }

  return status.toUpperCase();
}

function buildIssueFix(result, issue) {
  const target = result.adapter && result.adapter.target ? result.adapter.target : result.adapter.id;
  const repairPreview = `node scripts/ecc.js repair --target ${target} --dry-run`;

  if ([
    'missing-managed-files',
    'drifted-managed-files',
    'unverified-managed-operations',
    'manifest-version-mismatch',
    'repo-version-mismatch',
    'resolution-drift',
  ].includes(issue.code)) {
    return repairPreview;
  }

  if (issue.code === 'missing-source-files') {
    return 'Pull or restore the EOC source repo, then rerun the repair dry-run.';
  }

  if (issue.code === 'missing-target-root') {
    return `Restore the target root or reinstall with node scripts/ecc.js install --target ${target}`;
  }

  if (issue.code === 'target-root-mismatch' || issue.code === 'install-state-path-mismatch') {
    return `Run doctor from the project that owns this install-state, then preview repair with ${repairPreview}`;
  }

  if (issue.code === 'invalid-install-state') {
    return 'Inspect the install-state JSON before repair; it could not be parsed safely.';
  }

  if (issue.code === 'resolution-unavailable') {
    return 'Fix the recorded install request or manifests, then rerun doctor.';
  }

  return repairPreview;
}

function printHuman(report) {
  if (report.results.length === 0) {
    console.log('No ecc install-state files found for the current home/project context.');
    return;
  }

  console.log('Doctor report:\n');
  for (const result of report.results) {
    console.log(`- ${result.adapter.id}`);
    console.log(`  Status: ${statusLabel(result.status)}`);
    console.log(`  Install-state: ${result.installStatePath}`);

    if (result.issues.length === 0) {
      console.log('  Issues: none');
      continue;
    }

    for (const issue of result.issues) {
      console.log(`  - [${issue.severity}] ${issue.code}: ${issue.message}`);
      console.log(`    Fix: ${buildIssueFix(result, issue)}`);
    }
  }

  console.log(`\nSummary: checked=${report.summary.checkedCount}, ok=${report.summary.okCount}, warnings=${report.summary.warningCount}, errors=${report.summary.errorCount}`);
}

function main() {
  try {
    const options = parseArgs(process.argv);
    if (options.help) {
      showHelp(0);
    }

    const report = buildDoctorReport({
      repoRoot: require('path').join(__dirname, '..'),
      homeDir: process.env.HOME || os.homedir(),
      projectRoot: process.cwd(),
      targets: options.targets,
    });
    const hasIssues = report.summary.errorCount > 0 || report.summary.warningCount > 0;

    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printHuman(report);
    }

    process.exitCode = hasIssues ? 1 : 0;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
