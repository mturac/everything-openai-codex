#!/usr/bin/env node
const { readStdin, runExistingHook, transformToCodex, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  const input = JSON.parse(raw || '{}');
  const codexInput = transformToCodex(input);

  if (hookEnabled('stop:check-console-log', ['standard', 'strict'])) {
    runExistingHook('check-console-log.js', codexInput);
  }
  if (hookEnabled('stop:session-end', ['minimal', 'standard', 'strict'])) {
    runExistingHook('session-end.js', codexInput);
  }
  if (hookEnabled('stop:evaluate-session', ['minimal', 'standard', 'strict'])) {
    runExistingHook('evaluate-session.js', codexInput);
  }
  if (hookEnabled('stop:cost-tracker', ['minimal', 'standard', 'strict'])) {
    runExistingHook('cost-tracker.js', codexInput);
  }

  process.stdout.write(raw);
}).catch(() => process.exit(0));
