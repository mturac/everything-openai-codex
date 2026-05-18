#!/usr/bin/env node
const { hookEnabled, readStdin, runExistingHook, transformToCodex } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const codexInput = transformToCodex(input, {
      tool_input: { file_path: input.path || input.file || '' }
    });
    const codexStr = JSON.stringify(codexInput);

    // Accumulate edited paths for batch format+typecheck at stop time
    runExistingHook('post-edit-accumulator.js', codexStr);
    runExistingHook('post-edit-console-warn.js', codexStr);
    if (hookEnabled('post:edit:design-quality-check', ['standard', 'strict'])) {
      runExistingHook('design-quality-check.js', codexStr);
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
