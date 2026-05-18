#!/usr/bin/env node
const { readStdin, runExistingHook, transformToCodex } = require('./adapter');
readStdin().then(raw => {
  const codexInput = JSON.parse(raw || '{}');
  runExistingHook('pre-compact.js', transformToCodex(codexInput));
  process.stdout.write(raw);
}).catch(() => process.exit(0));
