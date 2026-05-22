# ecc v2.0.0-rc.1 Naming And Publication Matrix

Snapshot date: 2026-05-12.

This matrix answers the release question "ship as Everything OpenAI Codex, ecc,
or a renamed surface?" for the rc.1 lane. It is evidence for planning, not a
publication action.

## Decision

For `v2.0.0-rc.1`, keep the public identity as **Everything OpenAI Codex (EOC)**.
Use **EOC** in public copy and `eoc` for the Codex plugin slug. Keep `ecc`
only where it names existing scripts, legacy command namespaces, or historical
release evidence. Do not rename the GitHub repo, npm package, or package entry
points before the rc.1 release.

Reason:

- the current install surface uses `@mturac/eoc` plus the short `eoc`
  Codex plugin slug;
- the exact npm package name `ecc` is already occupied by an unrelated elliptic
  curve cryptography package;
- the repo name `mehmet-turac/ecc` is not present, but renaming
  `mturac/everything-openai-codex` before rc.1 would create avoidable URL,
  package, docs, and marketplace churn;
- Codex and Codex plugin surfaces are already short enough as `ecc`;
- rc.1 should prove the release, plugin, and publication pipeline before any
  broader brand migration.

## Current Values

| Surface | Current value | Evidence command | 2026-05-12 result | Release decision |
| --- | --- | --- | --- | --- |
| Product display name | `Everything OpenAI Codex` | `rg -n "Everything OpenAI Codex" README.md CHANGELOG.md docs/releases/2.0.0-rc.1` | Present across README, release notes, launch copy, and plugin manifests | Keep for rc.1 |
| Short name | `EOC` | README/release docs | Used as the short public brand | Keep and prefer in tight copy |
| GitHub repo | `mturac/everything-openai-codex` | `git remote get-url origin` | `https://github.com/mturac/everything-openai-codex.git` | Keep for rc.1 |
| Possible short repo | `mehmet-turac/ecc` | `gh repo view mehmet-turac/ecc` | Not found with current auth | Candidate after rc.1 only |
| npm package | `@mturac/eoc` | `node -p "require('./package.json').name"` | `@mturac/eoc` | Keep for rc.1 |
| npm package version | `2.0.0-rc.1` local; scoped package unpublished | `node -p "require('./package.json').version"` and `npm view @mturac/eoc name version dist-tags --json` | Local rc.1 is ready; registry returns 404 until first publish | Publish rc as `next`, not `latest` |
| Exact npm short name | `ecc` | `npm view ecc name version description repository.url --json` | Occupied by `ecc@0.0.2`, "Elliptic curve cryptography functions." | Do not use |
| Scoped npm short name | `@mehmet-turac/ecc` | `npm view @mehmet-turac/ecc name version --json` | Registry 404 | Possible future scoped package if npm scope policy permits |
| Former package name | `Everything OpenAI Codex` | `npm view Everything OpenAI Codex name version dist-tags --json` | Registry reports unpublished on 2026-02-07 | Do not revive for rc.1 |
| Codex plugin slug | `eoc` | `node -p "require('./.codex-plugin/plugin.json').name"` | `eoc` | Keep |
| Codex plugin version | `2.0.0-rc.1` | `codex plugin validate .codex-plugin/plugin.json` | Validation passed on OpenAI Codex `2.1.121` | Ready for release-tag gate |
| Codex marketplace entry | `eoc` | `.codex-plugin/marketplace.json` and `.agents/plugins/marketplace.json` | Version and repo point at current rc.1 surface | Keep |
| Codex plugin slug | `eoc` | `node -p "require('./.codex-plugin/plugin.json').name"` | `eoc` | Keep |
| Codex plugin version | `2.0.0-rc.1` | `node tests/docs/ecc2-release-surface.test.js` | Release surface test passed | Ready for Codex marketplace/manual marketplace gate |
| Codex repo marketplace | `eoc` | `.agents/plugins/marketplace.json`; `codex plugin marketplace add --help` | Repo marketplace add supports GitHub shorthand and local roots; local temp-home add smoke passed | Use as rc.1 Codex distribution path |
| OpenCode package | `@mturac/eoc` | `node -p "require('./.opencode/package.json').name"` | `@mturac/eoc` | Keep |
| OpenCode build | Generated package output | `npm run build:opencode` | Passed | Ready for package dry-run gate |
| npm pack surface | Reduced runtime package | `npm pack --dry-run --json` | Produced `mturac-eoc-2.0.0-rc.1.tgz`, 969 entries, about 5.0 MB unpacked | Needs final release-commit rerun |

## Publication Paths

| Path | Current evidence | Required next action | Blocker |
| --- | --- | --- | --- |
| GitHub release | `docs/releases/2.0.0-rc.1/` and release notes are in-tree | Re-run required command evidence from the final release commit, then create/verify `v2.0.0-rc.1` prerelease | No tag/release yet |
| npm | `@mturac/eoc` local package version is `2.0.0-rc.1`; registry returns 404 until first publish | Publish rc with `npm publish --tag next` after final `npm pack --dry-run` and release tests | Do not publish before final release commit |
| Codex plugin | `codex plugin validate .codex-plugin/plugin.json` passed; `codex plugin tag --help` confirms the release tag flow creates `{name}--v{version}` tags and can push them | Run `codex plugin tag .codex-plugin --dry-run` from the clean release commit, then tag/push only after release approval | No plugin release tag created in this pass |
| Codex marketplace | `.codex-plugin/marketplace.json` points at `eoc` and the public repo | Verify marketplace update/install path after tag exists | External marketplace propagation not verified |
| Codex plugin | `codex plugin marketplace` supports add/upgrade/remove; `.codex-plugin/plugin.json` is present; `.agents/plugins/marketplace.json` exposes `eoc` from the repo root; temp-home local `codex plugin marketplace add` passed | Publish rc.1 docs with the repo-marketplace command, then monitor OpenAI's official Plugin Directory self-serve path | Official Plugin Directory publishing is documented as coming soon |
| OpenCode package | `.opencode/package.json` builds from source and ships inside npm package | Re-run `npm run build:opencode` and package dry-run from release commit | OpenCode CLI 1.2.21 does not expose a separate plugin publication command in this pass |
| ecc Tools billing claim | README and launch copy mention ecc Tools / marketplace context | ecc-Tools #73 adds `/api/billing/readiness` `announcementGate`; run it against a Marketplace-managed test account before any payment announcement | Billing announcement code gate exists; live Marketplace account readback still pending |
| Social and longform copy | X thread, LinkedIn copy, article outline, GitHub release copy exist | Replace any stale URLs, then publish only after release/npm/plugin URLs work | Public URLs not final until release actions complete |

## Rename After rc.1

If the project moves from "Everything OpenAI Codex" toward "ecc" after rc.1,
do it as a staged migration:

1. Keep `@mturac/eoc` as the npm package until a replacement package has a
   verified owner, deprecation plan, and install migration.
2. Keep `mturac/everything-openai-codex` as the canonical repo until release
   notes, docs, plugin marketplace entries, npm metadata, and external links
   are prepared for redirects.
3. Use `ecc` as the product name in new diagrams, status payloads, and
   cross-harness docs immediately.
4. Reserve or create any new GitHub/npm/package surfaces before announcing the
   rename.
5. Ship a compatibility guide that maps old commands, package names, plugin
   slugs, and docs URLs to the new names.

## Evidence Captured In This Pass

```text
git rev-parse HEAD
7109ee08db7209c5d14809efcf832043020dfc57

node -p "require('./package.json').name + '@' + require('./package.json').version"
@mturac/eoc@2.0.0-rc.1

node -p "require('./.codex-plugin/plugin.json').name + '@' + require('./.codex-plugin/plugin.json').version"
ecc@2.0.0-rc.1

node -p "require('./.codex-plugin/plugin.json').name + '@' + require('./.codex-plugin/plugin.json').version"
ecc@2.0.0-rc.1

node -p "require('./.opencode/package.json').name + '@' + require('./.opencode/package.json').version"
@mturac/eoc@2.0.0-rc.1

npm view ecc name version description repository.url --json
ecc@0.0.2 is occupied by an unrelated elliptic curve cryptography package.

npm view @mturac/eoc name version dist-tags --json
registry returns 404; no rc dist-tag exists yet.

codex plugin validate .codex-plugin/plugin.json
Validation passed on OpenAI Codex 2.1.121.

node tests/docs/ecc2-release-surface.test.js
18 release-surface checks passed.

node tests/scripts/npm-publish-surface.test.js
2 npm publish-surface checks passed.

npm run build:opencode
Passed.

npm pack --dry-run --json
Produced mturac-eoc-2.0.0-rc.1.tgz, 969 entries, about 5.0 MB unpacked.

codex plugin marketplace add --help
Supports GitHub shorthand, HTTP(S) Git URLs, SSH URLs, local marketplace roots,
--ref, and Git-only --sparse.

HOME="$(mktemp -d)" codex plugin marketplace add <local-checkout>
Added marketplace ecc and recorded the installed marketplace root as
<local-checkout> without touching the real Codex config.
```
