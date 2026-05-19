# Public PR Queue Snapshot - 2026-05-20

Snapshot of the public Everything OpenAI Codex PR queue after the rc.1 release-surface cleanup.

## Current State

- Main repo: no open PRs in `mturac/everything-openai-codex`.
- Public listing PRs: 26 open Everything OpenAI Codex PRs.
- Related OSS contribution PRs: 1 open Codex automation contribution.
- Clean duplicate handling: closed `ai-for-developers/awesome-ai-coding-tools#331` in favor of `#333`.
- Rejected or closed without merge: recorded below; no repeat submissions for the same target without new evidence.

## Open PRs With Maintainer Or Bot Activity

| PR | Status | Follow-up posture |
|---|---|---|
| `hashgraph-online/awesome-codex-plugins#128` | Open, mergeable, checks green | Feedback addressed. Bundle is metadata-only, stale website metadata removed, and validation is green. Wait for maintainer. |
| `e2b-dev/awesome-ai-agents#975` | Open, mergeable, CLA check green | CLA issue resolved. No extra comment needed. Wait for maintainer. |

## Open PRs With No Comments

These are clean wait states. Do not bump them unless maintainers ask for changes.

| Target | PR |
|---|---|
| `ai-for-developers/awesome-vibe-coding` | `#66` |
| `yubing744/awesome-agentic-coding-cli` | `#2` |
| `caramaschiHG/awesome-ai-agents-2026` | `#267` |
| `Jenqyang/Awesome-AI-Agents` | `#244` |
| `slavakurilyak/awesome-ai-agents` | `#269` |
| `vanna-ai/Awesome-Vibe-Coding-CLI` | `#6` |
| `ColinEberhardt/awesome-ai-developer-tools` | `#24` |
| `ai-for-developers/awesome-ai-coding-tools` | `#333` |
| `quome-cloud/awesome-coding-agents` | `#6` |
| `KarelDO/awesome-codex` | `#14` |
| `dremeika/awesome-coding-assistants` | `#12` |
| `RoggeOhta/awesome-codex-cli` | `#43` |
| `filipecalegario/awesome-vibe-coding` | `#188` |
| `jim-schwoebel/awesome_ai_agents` | `#287` |
| `flatlogic/awesome-ai-software-development-agents` | `#15` |
| `tranhoangpich/awesome-agentic-coding` | `#4` |
| `CodandoTV/awesome-ai-coding-assistants-playbook` | `#9` |
| `wdzhwsh4067/awesome-coding-agents` | `#2` |
| `ComposioHQ/awesome-codex-skills` | `#74` |
| `wsxiaoys/awesome-ai-coding` | `#104` |
| `vaderyang/awesome-openai-codex` | `#3` |
| `devtoolsd/awesome-devtools` | `#231` |
| `namphuongtran/awesome-ai-coding-agent-tools` | `#6` |
| `launchapp-dev/awesome-ai-coding-tools` | `#5` |

## Related OSS Contribution PRs

This queue includes one non-listing contribution that supports the same public posture without directly promoting EOC.

| Target | PR | Why it fits |
|---|---|---|
| `onurkanbakirci/awesome-codex-automations` | `#3` | Adds `Public PR Queue Watch`, a Codex automation for tracking listing PRs without spammy bumps or automatic resubmissions. |

## Closed Or Rejected

| PR | Result | Decision |
|---|---|---|
| `milisp/awesome-codex-cli#32` | Merged | Success. |
| `shinpr/awesome-codex-workflows#14` | Closed after maintainer review | Do not argue. The feedback was useful: EOC needs an even clearer owned execution model before retrying this specific list. |
| `kyrolabs/awesome-agents#489` | Closed silently | Do not resubmit now. Treat as low-signal target unless new adoption evidence appears. |
| `ai-for-developers/awesome-ai-coding-tools#331` | Closed by me | Duplicate of cleaner `#333`. |
| `e2b-dev/awesome-ai-agents#976` | Closed duplicate | Replaced by `#975`. |
| `milisp/awesome-codex-cli#31` | Closed duplicate | Replaced by merged `#32`. |
| `RoggeOhta/awesome-codex-cli#42` | Closed duplicate | Replaced by open `#43`. |
| `hashgraph-online/awesome-codex-plugins#127` | Closed duplicate | Replaced by open `#128`. |

## Copy Updates Applied

The remaining older PR titles/bodies that still used shorthand or pre-EOC naming were updated:

- `vaderyang/awesome-openai-codex#3`
- `devtoolsd/awesome-devtools#231`
- `wsxiaoys/awesome-ai-coding#104`
- `ai-for-developers/awesome-ai-coding-tools#331` before closing it as duplicate

Cleaner listing copy was also pushed to the open branches for `#3`, `#231`, and `#104`, so the visible diff now starts with `Everything OpenAI Codex`.

## Same-Day Additions

Only high-fit targets that were not already open or rejected were added:

- `namphuongtran/awesome-ai-coding-agent-tools#6`: EOC under Methodologies & Spec-Driven Workflows with strengths and caveats.
- `launchapp-dev/awesome-ai-coding-tools#5`: EOC under Prompt & Context Engineering with one concise entry.
- `onurkanbakirci/awesome-codex-automations#3`: a real `Public PR Queue Watch` automation instead of a plain promotional listing.

## Next Rule

No spam follow-ups. Check the queue daily, reply only when a maintainer asks a question, and turn rejections into repo improvements before retrying any target.
