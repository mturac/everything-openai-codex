# Public Review Guide

This page is for maintainers, directory reviewers, and community members who need to evaluate Everything OpenAI Codex quickly.

## 60-Second Summary

EOC is a Codex-first workflow system, not a prompt dump or a directory mirror. It packages a repeatable operator loop:

```text
Intake -> Route -> Plan -> Execute -> Verify -> Capture -> Resume
```

The loop is backed by repo assets that can be inspected directly:

| Question | Evidence |
|---|---|
| What does the agent own? | `AGENTS.md`, `.codex/AGENTS.md`, `agent.yaml`, `.codexignore` |
| How does work route to expertise? | `skills/`, `agents/`, `rules/`, `commands/`, `docs/COMMAND-AGENT-MAP.md` |
| How is execution kept repeatable? | install profiles, hook scripts, MCP configs, cross-harness adapters |
| How is completion verified? | `skills/verification-loop/`, `skills/eval-harness/`, `/quality-gate`, `tests/`, `scripts/preview-pack-smoke.js` |
| How does long work resume? | `scripts/status.js`, `scripts/work-items.js`, `scripts/session-inspect.js`, `scripts/sessions-cli.js`, `ecc2/` alpha session commands |

## What EOC Is

- a maintained Codex workflow system for real software work
- a curated skill, agent, rule, hook, install, and validation surface
- a cross-harness portability layer for Codex, Cursor, OpenCode, Gemini, Zed, Copilot, Trae, and adjacent harnesses
- an MIT-licensed repo with explicit rc.1 release evidence and validation tests

## What EOC Is Not

- not a set of copied prompts with new branding
- not a claim that every harness has identical hook/runtime behavior
- not a stable `ecc2` runtime release; `ecc2/` is currently an alpha control-plane prototype
- not a paid marketplace product, SaaS, or closed GitHub App
- not a reason to spam public lists with duplicate submissions

## How To Verify The Current Surface

Run the focused checks before judging the public package:

```bash
npm run lint
node tests/plugin-manifest.test.js
node tests/docs/ecc2-release-surface.test.js
node tests/docs/canary-watch.test.js
python3 ~/.codex/skills/promptguard/scripts/audit_prompt.py AGENTS.md --format markdown
python3 ~/.codex/skills/promptguard/scripts/audit_prompt.py agent.yaml --format markdown
```

Optional package check:

```bash
npm pack --dry-run
npm audit --audit-level=high
```

The public README intentionally points to live GitHub and npm badges instead of fixed vanity metrics.

## Provenance And Adaptation

EOC reuses good open-source ideas, and curated repo skills must become EOC-native surfaces before shipping. The adaptation standard is documented in:

- [Skill Adaptation Policy](skill-adaptation-policy.md)
- [Skill Placement and Provenance Policy](SKILL-PLACEMENT-POLICY.md)

Reviewer rule of thumb: a shipped EOC surface should make sense to a Codex user without knowing an upstream repo.

## Public Submission Etiquette

For awesome lists, plugin directories, and community catalogs:

- submit only where the category fits the actual repo
- prefer one clean PR over repeated comments or duplicate PRs
- silent closes stay recorded without chase comments
- rejections become learning inputs, not debate threads
- use [canary-watch](../skills/canary-watch/SKILL.md) to monitor public PR queue health without noisy follow-ups

## Alignment With Codex Workflows

EOC's public positioning matches the Codex workflow direction documented by OpenAI: repeatable skills, PR review, long-horizon task follow-through, codebase-aware changes, and evidence-backed verification.

Relevant official references:

- [OpenAI Codex use cases](https://developers.openai.com/codex/use-cases)
- [OpenAI developer resources](https://developers.openai.com/resources)

## Reviewer Checklist

- Does the proposed listing describe EOC as a workflow system, not only a catalog?
- Does it link to the public repo and the execution model?
- Does it avoid fixed star counts, unsupported awards, or paid-product claims?
- Does it respect the target repo's category and repository rules?
- Does it point to validation evidence instead of asking maintainers to trust the pitch?

If those checks pass, EOC is suitable for Codex workflow, coding-agent, plugin, skill, and developer directories. If a target list requires proven adoption or production user counts, wait until that evidence exists.
