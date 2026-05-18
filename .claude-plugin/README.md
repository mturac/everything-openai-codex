### Plugin Manifest Gotchas

If you plan to edit `.codex-plugin/plugin.json`, be aware that the Codex plugin validator enforces several **undocumented but strict constraints** that can cause installs to fail with vague errors (for example, `agents: Invalid input`). In particular, component fields must be arrays, `agents` is not a supported manifest field and must not be included in plugin.json, and a `version` field is required for reliable validation and installation.

These constraints are not obvious from public examples and have caused repeated installation failures in the past. They are documented in detail in `.codex-plugin/PLUGIN_SCHEMA_NOTES.md`, which should be reviewed before making any changes to the plugin manifest.

### Custom Endpoints and Gateways

ecc does not override OpenAI Codex transport settings. If OpenAI Codex is configured to run through an official LLM gateway or a compatible custom endpoint, the plugin continues to work because hooks, skills, and any retained legacy command shims execute locally after the CLI starts successfully.

Use OpenAI Codex's own environment/configuration for transport selection, for example:

```bash
export OPENAI_BASE_URL=https://your-gateway.example.com
export OPENAI_AUTH_TOKEN=your-token
codex
```
