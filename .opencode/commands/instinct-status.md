---
description: Show learned instincts (project + global) with confidence
agent: everything-openai-codex:build
---

# Instinct Status Command

Show instinct status from continuous-learning-v2: $ARGUMENTS

## Your Task

Run:

```bash
python3 "${CODEX_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

If `CODEX_PLUGIN_ROOT` is unavailable, use:

```bash
python3 ~/.codex/skills/continuous-learning-v2/scripts/instinct-cli.py status
```

## Behavior Notes

- Output includes both project-scoped and global instincts.
- Project instincts override global instincts when IDs conflict.
- Output is grouped by domain with confidence bars.
- This command does not support extra filters in v2.1.
