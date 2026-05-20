#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const { listAvailableLanguages } = require('./lib/install-executor');

const COMMANDS = {
  install: {
    script: 'install-apply.js',
    description: 'Install EOC content into a supported target',
  },
  plan: {
    script: 'install-plan.js',
    description: 'Inspect selective-install manifests and resolved plans',
  },
  catalog: {
    script: 'catalog.js',
    description: 'Discover install profiles and component IDs',
  },
  consult: {
    script: 'consult.js',
    description: 'Recommend EOC components and profiles from a natural language query',
  },
  'install-plan': {
    script: 'install-plan.js',
    description: 'Alias for plan',
  },
  'list-installed': {
    script: 'list-installed.js',
    description: 'Inspect install-state files for the current context',
  },
  doctor: {
    script: 'doctor.js',
    description: 'Diagnose missing or drifted EOC-managed files',
  },
  repair: {
    script: 'repair.js',
    description: 'Restore drifted or missing EOC-managed files',
  },
  'auto-update': {
    script: 'auto-update.js',
    description: 'Pull latest EOC changes and reinstall the current managed targets',
  },
  status: {
    script: 'status.js',
    description: 'Query the EOC SQLite state store status summary',
  },
  'platform-audit': {
    script: 'platform-audit.js',
    description: 'Audit GitHub queues, discussions, roadmap, release, and security evidence',
  },
  'security-ioc-scan': {
    script: 'ci/scan-supply-chain-iocs.js',
    description: 'Scan dependency and AI-tool persistence surfaces for active supply-chain IOCs',
  },
  sessions: {
    script: 'sessions-cli.js',
    description: 'List or inspect EOC sessions from the SQLite state store',
  },
  'work-items': {
    script: 'work-items.js',
    description: 'Track linked Linear, GitHub, handoff, and manual work items',
  },
  'session-inspect': {
    script: 'session-inspect.js',
    description: 'Emit canonical EOC session snapshots from dmux or Codex history targets',
  },
  'loop-status': {
    script: 'loop-status.js',
    description: 'Inspect Codex transcripts for stale loop wakeups and pending tool results',
  },
  uninstall: {
    script: 'uninstall.js',
    description: 'Remove EOC-managed files recorded in install-state',
  },
};

const PRIMARY_COMMANDS = [
  'install',
  'plan',
  'catalog',
  'consult',
  'list-installed',
  'doctor',
  'repair',
  'auto-update',
  'status',
  'platform-audit',
  'security-ioc-scan',
  'sessions',
  'work-items',
  'session-inspect',
  'loop-status',
  'uninstall',
];

function showHelp(exitCode = 0) {
  console.log(`
EOC selective-install CLI

Usage:
  eoc <command> [args...]
  eoc [install args...]

Commands:
${PRIMARY_COMMANDS.map(command => `  ${command.padEnd(15)} ${COMMANDS[command].description}`).join('\n')}

Compatibility:
  eoc-install        Install entrypoint for npm users
  ecc                Legacy alias retained for existing EOC installs
  ecc-install        Legacy install alias retained for existing flows
  eoc help <command> Show help for a specific command

Examples:
  eoc typescript
  eoc install --profile developer --target codex
  eoc plan --profile core --target cursor
  eoc catalog profiles
  eoc catalog components --family language
  eoc catalog search security
  eoc catalog show framework:nextjs
  eoc consult "security reviews"
  eoc list-installed --json
  eoc doctor --target cursor
  eoc repair --dry-run
  eoc auto-update --dry-run
  eoc status --json
  eoc status --exit-code
  eoc status --markdown --write status.md
  eoc platform-audit --json --allow-untracked docs/drafts/
  eoc security-ioc-scan --home
  eoc sessions
  eoc sessions session-active --json
  eoc work-items upsert linear-eoc-20 --source linear --source-id eoc-20 --title "Review control-plane contract" --status blocked
  eoc work-items sync-github --repo mehmet-turac/everything-openai-codex
  eoc session-inspect codex:latest
  eoc loop-status --json
  eoc uninstall --target antigravity --dry-run
`);

  process.exit(exitCode);
}

function resolveCommand(argv) {
  const args = argv.slice(2);

  if (args.length === 0) {
    return { mode: 'help' };
  }

  const [firstArg, ...restArgs] = args;

  if (firstArg === '--help' || firstArg === '-h') {
    return { mode: 'help' };
  }

  if (firstArg === 'help') {
    return {
      mode: 'help-command',
      command: restArgs[0] || null,
    };
  }

  if (COMMANDS[firstArg]) {
    return {
      mode: 'command',
      command: firstArg,
      args: restArgs,
    };
  }

  const knownLegacyLanguages = listAvailableLanguages();
  const shouldTreatAsImplicitInstall = (
    firstArg.startsWith('-')
    || knownLegacyLanguages.includes(firstArg)
  );

  if (!shouldTreatAsImplicitInstall) {
    throw new Error(`Unknown command: ${firstArg}`);
  }

  return {
    mode: 'command',
    command: 'install',
    args,
  };
}

function runCommand(commandName, args) {
  const command = COMMANDS[commandName];
  if (!command) {
    throw new Error(`Unknown command: ${commandName}`);
  }

  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, command.script), ...args],
    {
      cwd: process.cwd(),
      env: process.env,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (typeof result.status === 'number') {
    return result.status;
  }

  if (result.signal) {
    throw new Error(`Command "${commandName}" terminated by signal ${result.signal}`);
  }

  return 1;
}

function main() {
  try {
    const resolution = resolveCommand(process.argv);

    if (resolution.mode === 'help') {
      showHelp(0);
    }

    if (resolution.mode === 'help-command') {
      if (!resolution.command) {
        showHelp(0);
      }

      if (!COMMANDS[resolution.command]) {
        throw new Error(`Unknown command: ${resolution.command}`);
      }

      process.exitCode = runCommand(resolution.command, ['--help']);
      return;
    }

    process.exitCode = runCommand(resolution.command, resolution.args);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
