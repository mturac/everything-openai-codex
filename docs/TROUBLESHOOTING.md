# Troubleshooting

Community-reported workarounds for current OpenAI Codex bugs that can affect ecc users.

These are upstream OpenAI Codex behaviors, not ecc bugs. The entries below summarize the production-tested workarounds collected in [issue #644](https://github.com/mturac/everything-openai-codex/issues/644) on OpenAI Codex `v2.1.79` (macOS, heavy hook usage, MCP connectors enabled). Treat them as pragmatic stopgaps until upstream fixes land.

## Community Workarounds For Open OpenAI Codex Bugs

### False "Hook Error" labels on otherwise successful hooks

**Symptoms:** Hook runs successfully, but OpenAI Codex still shows `Hook Error` in the transcript.

**What helps:**

- Consume stdin at the start of the hook (`input=$(cat)` in shell hooks) so the parent process does not see an unconsumed pipe.
- For simple allow/block hooks, send human-readable diagnostics to stderr and keep stdout quiet unless your hook implementation explicitly requires structured stdout.
- Redirect noisy child-process stderr when it is not actionable.
- Use the correct exit codes: `0` allows, `2` blocks, other non-zero exits are treated as errors.

**Example:**

```bash
# Good: block with stderr message and exit 2
input=$(cat)
echo "[BLOCKED] Reason here" >&2
exit 2
```

### Earlier-than-expected compaction with `CODEX_AUTOCOMPACT_PCT_OVERRIDE`

**Symptoms:** Lowering `CODEX_AUTOCOMPACT_PCT_OVERRIDE` causes compaction to happen sooner, not later.

**What helps:**

- On some current OpenAI Codex builds, lower values may reduce the compaction threshold instead of extending it.
- If you want more working room, remove `CODEX_AUTOCOMPACT_PCT_OVERRIDE` and prefer manual `/compact` at logical task boundaries.
- Use ecc's `strategic-compact` guidance instead of forcing a lower auto-compact threshold.

### MCP connectors look connected but fail after compaction

**Symptoms:** Gmail or Google Drive MCP tools fail after compaction even though the connector still looks authenticated in the UI.

**What helps:**

- Toggle the affected connector off and back on after compaction.
- If your OpenAI Codex build supports it, add a `PostCompact` reminder hook that warns you to re-check connector auth after compaction.
- Treat this as an auth-state recovery step, not a permanent fix.

### Hook edits do not hot-reload

**Symptoms:** Changes to `settings.json` hooks do not take effect until the session is restarted.

**What helps:**

- Restart the OpenAI Codex session after changing hooks.
- Advanced users sometimes script a local `/reload` command around `kill -HUP $PPID`, but ecc does not ship that because it is shell-dependent and not universally reliable.

### Repeated `529 Overloaded` responses

**Symptoms:** OpenAI Codex starts failing under high hook/tool/context pressure.

**What helps:**

- Reduce tool-definition pressure with `ENABLE_TOOL_SEARCH=auto:5` if your setup supports it.
- Lower `MAX_THINKING_TOKENS` for routine work.
- Route subagent work to a cheaper model such as `CODEX_CODE_SUBAGENT_MODEL=fast` if your setup exposes that knob.
- Disable unused MCP servers per project.
- Compact manually at natural breakpoints instead of waiting for auto-compaction.

## Related ecc Docs

- [hook-bug-workarounds.md](./hook-bug-workarounds.md) for the shorter hook/compaction/MCP recovery checklist.
- [hooks/README.md](../hooks/README.md) for ecc's documented hook lifecycle and exit-code behavior.
- [token-optimization.md](./token-optimization.md) for cost and context management settings.
- [issue #644](https://github.com/mturac/everything-openai-codex/issues/644) for the original report and tested environment.
