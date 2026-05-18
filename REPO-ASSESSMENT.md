# Repo Assessment

**Date:** 2026-05-18

## Current State

This repository is now positioned as **Everything OpenAI Codex (EOC)**: an
open-source Codex workflow system covering skills, agents, hooks, rules, MCP
configuration, install profiles, release evidence, and cross-harness adapters.

| Attribute | Current value |
| --- | --- |
| Package | `ecc-universal` |
| Version | `2.0.0-rc.1` |
| Codex plugin identifier | `eoc@eoc` |
| Repository | `mehmet-turac/everything-openai-codex` |
| License | MIT |
| Primary install path | Codex repo marketplace or manual scoped installer |

## What Is Solid

- Codex-native package metadata exists in `.codex-plugin/plugin.json`,
  `.agents/plugins/marketplace.json`, `.codex/AGENTS.md`, and `agent.yaml`.
- The public docs now explain the short `eoc@eoc` plugin identifier and warn
  users not to stack plugin installs with full manual installs.
- rc.1 release evidence exists under `docs/releases/2.0.0-rc.1/` and separates
  verified surfaces from approval-gated publication steps.
- Tests cover catalog counts, install identifiers, plugin manifest shape,
  release surface, hook behavior, and package payloads.

## Fixed Gaps

- Removed stale fork-era assessment language that still described the project as
  a `1.9.0` fork rather than the active `2.0.0-rc.1` Codex project.
- Replaced brittle vanity metrics and hackathon-winner claims with live badge
  references and product-specific positioning.
- Corrected release workflow copy so generated release notes advertise the
  canonical `eoc@eoc` plugin identifier.

## Remaining Release Gates

- Create the GitHub prerelease tag only from a clean release checkout.
- Publish `ecc-universal@2.0.0-rc.1` to npm only after approval.
- Re-run plugin marketplace validation from the final tag before public launch.
- Keep official Plugin Directory copy framed as coming soon until OpenAI's
  self-serve public plugin path is available.

## Recommended Default

Keep the project Codex-first and evidence-backed: public claims should point to
live badges, release evidence, tests, and installable artifacts instead of fixed
star/fork counts or unverifiable award copy.
