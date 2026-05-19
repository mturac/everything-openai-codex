# ecc v2.0.0-rc.1 Publication Evidence — 2026-05-12

This is dry-run release evidence only. It does not create a GitHub release, npm
publication, plugin tag, marketplace submission, or announcement post.

## Source Commit

| Field | Evidence |
| --- | --- |
| Upstream main base | `0598af70a51346bae34d987b9bed143386055967` |
| Evidence branch | `codex/release-publication-evidence` |
| Evidence scope | Working tree with this branch's package hygiene and release-doc updates |
| Git remote | `https://github.com/mturac/everything-openai-codex.git` |
| Local status caveat | Working tree had the unrelated untracked `docs/drafts/` directory |

The actual release operator should repeat these checks from the final release
commit with a clean checkout before publishing.

## Registry And Release State

| Surface | Command | Result |
| --- | --- | --- |
| GitHub prerelease | `gh release view v2.0.0-rc.1 --repo mturac/everything-openai-codex --json tagName,url,isPrerelease` | `release not found` |
| npm dist-tags | `npm view @mturac/eoc dist-tags --json` | `E404 Not Found until first publish` |
| npm package metadata | `node -p "require('./package.json').name + '@' + require('./package.json').version"` | `@mturac/eoc@2.0.0-rc.1` |
| Product identity | `rg -n "Everything OpenAI Codex" README.md CHANGELOG.md docs/releases/2.0.0-rc.1` | Present in README and rc.1 release docs |

## npm Dry Run

The first pack pass exposed local Python bytecode cache files in the tarball
because broad package `files` entries included untracked local `__pycache__`
paths. This branch adds explicit package-file exclusions and a regression test
so `npm pack` fails if Python bytecode appears in the package surface.

| Command | Result |
| --- | --- |
| `node tests/scripts/npm-publish-surface.test.js` | Passed `2/2`; includes Python bytecode exclusion assertion |
| `npm pack --dry-run --json` | `mturac-eoc-2.0.0-rc.1.tgz`; `entryCount: 965`; `size: 1565968`; `unpackedSize: 4934637`; `hasBytecode: false` |
| `npm publish --tag next --dry-run --json` | Dry-run target is npm registry with `tag next`; `entryCount: 965`; `hasBytecode: false` |

Temporary install smoke:

| Command | Result |
| --- | --- |
| `npm pack --pack-destination /tmp/ecc-publication-smoke-dd9ud5 --json` | Created `mturac-eoc-2.0.0-rc.1.tgz` for local install smoke |
| `npm install --prefix /tmp/ecc-publication-smoke-dd9ud5 /tmp/ecc-publication-smoke-dd9ud5/mturac-eoc-2.0.0-rc.1.tgz` | Added 8 packages |
| `node /tmp/ecc-publication-smoke-dd9ud5/node_modules/@mturac/eoc/scripts/ecc.js --help` | Printed ecc selective-install CLI help |
| `node /tmp/ecc-publication-smoke-dd9ud5/node_modules/@mturac/eoc/scripts/catalog.js profiles --json` | Returned the 6 install profiles: `minimal`, `core`, `developer`, `security`, `research`, `full` |
| `find /tmp/ecc-publication-smoke-dd9ud5/node_modules/@mturac/eoc -path '*__pycache__*' -o -name '*.pyc' -o -name '*.pyo' -o -name '*.pyd'` | No output |

## Plugin And Harness Evidence

| Surface | Command | Result |
| --- | --- | --- |
| Codex plugin manifest | `codex plugin validate .codex-plugin/plugin.json` | Passed |
| Codex plugin tag preflight | `codex plugin tag .codex-plugin --dry-run` | Blocked by unrelated untracked `docs/drafts/` |
| Codex plugin tag forced dry-run | `codex plugin tag .codex-plugin --dry-run --force` | Would create `ecc--v2.0.0-rc.1` at HEAD; do not use `--force` for real release unless maintainer decides |
| Codex marketplace CLI | `codex plugin marketplace --help` and subcommand help | Supports `add`, `upgrade`, and `remove`; `add` supports repo and local marketplace roots |
| OpenCode package | `npm run build:opencode` | Passed |
| Codex hook/plugin route | `node tests/hooks/hooks.test.js` | Passed `236/236` |
| Codex release surface | `node tests/docs/ecc2-release-surface.test.js` | Passed `18/18` |
| Agent/catalog metadata | `node tests/scripts/catalog.test.js` | Passed `7/7` |
| Observability gate | `npm run observability:ready` | Passed `16/16` |

## Clean-Checkout Codex Plugin Smoke

This follow-up pass used a detached clean worktree at
`/tmp/ecc-clean-plugin-evidence` from commit
`bfacf37715b39655cbc2c48f12f2a35c67cb0253`. It used an isolated temp home
(`HOME=/tmp/ecc-clean-plugin-home`) and a temp local project
(`/tmp/ecc-plugin-install-smoke`), so it did not write to the user's real Codex
plugin config.

| Command | Result |
| --- | --- |
| `git -C /tmp/ecc-clean-plugin-evidence status --short --branch` | `## HEAD (no branch)` with no dirty or untracked files |
| `codex plugin validate .codex-plugin/plugin.json` | Passed |
| `codex plugin validate .codex-plugin/marketplace.json` | Passed |
| `codex plugin tag .codex-plugin --dry-run` | Passed without `--force`; would create `ecc--v2.0.0-rc.1` at HEAD and push `refs/tags/ecc--v2.0.0-rc.1` |
| `codex plugin marketplace add /tmp/ecc-clean-plugin-evidence --scope local` with temp `HOME` | Added marketplace `ecc` in local settings |
| `codex plugin list --available --json` with temp `HOME` | Listed `ecc@ecc`, version `2.0.0-rc.1`, source `./` |
| `codex plugin install ecc@ecc --scope local` with temp `HOME` | Installed `ecc@ecc` in local scope |
| `codex plugin list --json` with temp `HOME` | Listed `ecc@ecc`, version `2.0.0-rc.1`, enabled, local scope, install path under `/tmp/ecc-clean-plugin-home/.codex/plugins/cache/ecc/ecc/2.0.0-rc.1` |
| `codex plugin uninstall ecc@ecc --scope local` with temp `HOME` | Uninstalled successfully; final plugin list was `[]` |

## Announcement Placeholder Check

The forbidden-placeholder scan only returned the publication-readiness checklist
lines that name those forbidden placeholders. No launch-pack placeholder
instances were found.

## Remaining Blockers

- Create or verify GitHub prerelease `v2.0.0-rc.1`.
- Publish `@mturac/eoc@2.0.0-rc.1` with npm dist-tag `next`.
- Create and push the Codex plugin tag only after explicit approval. The clean
  checkout dry run and temp install smoke now pass.
- Confirm the live Codex/Codex/OpenCode marketplace submission path or record
  the manual submission owner and status.
- Verify ecc Tools billing/App/Marketplace claims before using them in launch
  copy.
- Refresh announcement copy with live URLs after release and package/plugin
  URLs exist.
