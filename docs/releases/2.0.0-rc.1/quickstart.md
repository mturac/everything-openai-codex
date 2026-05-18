# ecc v2.0.0-rc.1 Quickstart

This path is for a new contributor who wants to verify the release surface before touching feature work.

## Clone

```bash
git clone https://github.com/mehmet-turac/everything-openai-codex.git
cd Everything OpenAI Codex
```

Start from a clean checkout. Do not copy private operator state, raw workspace exports, tokens, or local Hermes files into the repo.

## Install

```bash
npm ci
```

This installs the Node-based validation and packaging toolchain used by the public release surface.

## Verify

```bash
node tests/run-all.js
```

Expected result: every test passes with zero failures. For release-specific drift, run the focused check:

```bash
node tests/docs/ecc2-release-surface.test.js
```

Then check the local observability surface:

```bash
npm run observability:ready
```

This runs the [observability readiness gate](../../architecture/observability-readiness.md)
for loop status, session traces, harness audit, and ecc2 tool-risk logs.

## First Skill

Read `skills/hermes-imports/SKILL.md` first.

It shows the intended ecc 2.0 pattern:

- take a repeated operator workflow
- remove credentials, private paths, raw workspace exports, and personal memory
- keep the durable workflow shape
- publish the sanitized result as a reusable `SKILL.md`

Do not start by importing a private Hermes workflow wholesale. Start by distilling one reusable skill.

## Switch Harness

Use the same skill source across harnesses:

- OpenAI Codex consumes ecc through the Codex plugin and native hooks.
- Codex consumes ecc through `AGENTS.md`, `.codex-plugin/plugin.json`, and MCP reference config.
- OpenCode consumes ecc through the OpenCode package/plugin surface.

The portable unit is still `skills/*/SKILL.md`. Harness-specific files should load or adapt that source, not redefine the workflow.

## Next Docs

- [Hermes setup](../../HERMES-SETUP.md)
- [Cross-harness architecture](../../architecture/cross-harness.md)
- [Release notes](release-notes.md)
