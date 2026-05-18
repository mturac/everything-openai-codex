#!/usr/bin/env node
const { readStdin, runExistingHook, transformToCodex } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const codexInput = transformToCodex(input, {
      tool_input: { file_path: input.path || input.file || '' }
    });
    runExistingHook('post-edit-format.js', JSON.stringify(codexInput));
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
