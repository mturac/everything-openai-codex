#!/usr/bin/env node
const { readStdin, runExistingHook, transformToCodex, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  const input = JSON.parse(raw || '{}');
  const codexInput = transformToCodex(input);
  if (hookEnabled('session:start', ['minimal', 'standard', 'strict'])) {
    runExistingHook('session-start.js', codexInput);
  }
  process.stdout.write(raw);
}).catch(() => process.exit(0));
