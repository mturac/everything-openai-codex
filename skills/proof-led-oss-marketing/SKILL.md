---
name: proof-led-oss-marketing
description: Build reputation-safe open-source marketing from verifiable project evidence, not hype, spam, or repeated public pings. Use for launch copy, directory targeting, community posts, proof packets, and maintainer-facing positioning.
origin: eoc
---

# Proof-Led OSS Marketing

Use this skill when an open-source project needs attention without damaging
trust. The job is to turn real validation, docs, CI, screenshots, usage, and
maintainer behavior into credible distribution.

## Rule Precedence

Follow this order when instructions conflict:

1. Safety, privacy, credentials, and maintainer rules
2. No-spam boundaries in this skill
3. Truthful evidence level
4. User-requested marketing reach
5. Style and channel preferences

Public-action carve-outs: zero inside this skill for public posting, form
submission, listing PR creation, account actions, or paid placement. This skill
always stops at an evidence report and draft copy.

Allowed action carve-outs: zero inside this skill.

Conflict behavior: when a requested action conflicts with the ordered rules
above, stop after the evidence report and name the conflicting rule.

This skill does not define or call tools directly. If tools are needed, use only
the active runtime tool schema and treat missing authentication or low confidence
as `improve first` or `watch`, not as permission to guess.

## Contract

Own the marketing plan and proof packet.

Excluded actions:

- invented adoption, revenue, customer, star, download, or benchmark claims
- public comments, form submissions, and listing PR creation
- generic maintainer follow-ups
- weak-fit list placement
- treating "AI generated" volume as proof of quality

Prefer one strong, cited claim over five vague claims.

## Decision Context Defaults

Before recommending channels, fill these fields:

- market
- budget
- user preference
- timing
- constraints and must-avoid options
- ranking criteria

If the user does not specify the context, explicitly state these defaults:

- market: developer and open-source maintainer audiences
- budget: no paid placement or sponsorship
- timing: current repo state on the audit date
- preference: reputation-safe proof over maximum reach
- ranking: category fit, proof level, maintainer rules, then audience size

If a target depends on unknown local market, budget, account permission, or
private community access, classify it as `watch` until that context is verified.

Approval contract: channel analysis is acceptable only when the Decision Context
table includes market, budget, user preference, timing, constraints, and ranking
criteria as either sourced facts or intentionally stated defaults.

## Technical Risk Contract

Before editing repo files, state the target surface and rollback path.

Allowed edits from this skill are limited to durable marketing surfaces such as
README copy, public-review docs, screenshots, release notes, skill guidance, and
tests that verify those claims.

Excluded technical changes from this skill:

- product behavior
- CI release permissions
- package install logic
- external submissions

Verification must include the relevant docs tests, catalog checks when counts
change, PromptGuard for prompt-like files, and a final diff summary.

## Evidence Ladder

Classify every claim by the strongest available proof:

| Level | Proof | Example |
| --- | --- | --- |
| L0 | Intent only | roadmap, idea, draft |
| L1 | Repo proof | README, docs, commands, examples |
| L2 | Verification proof | CI run, tests, audit report, screenshots |
| L3 | External proof | accepted listing, user issue, maintainer review |
| L4 | Adoption proof | stars, installs, forks, real users, case study |

L0 claims stay labeled L0; L3 or L4 wording requires L3 or L4 proof.

## Workflow

1. Inventory proof.
   - Read the README, release notes, CI state, key screenshots, and current
     public queue artifacts.
   - Extract exact links or file paths for every claim.
2. Choose the channel.
   - Community post: useful when there is a story or lesson.
   - Awesome list PR: useful only with exact category fit.
   - Directory listing: useful when install and screenshots are stable.
   - Maintainer reply: useful only when someone asked for a concrete answer.
3. Convert proof into positioning.
   - Name the real user and pain.
   - State the execution model.
   - Cite validation.
   - Explain why this belongs in that community.
4. Decide action.
   - `publish`: enough proof, correct audience, no active blocker.
   - `improve first`: proof exists but the repo surface is weak.
   - `watch`: no action needed or review is pending.
   - `skip`: wrong audience, paid gate, duplicate, or spam risk.

## Proof Packet

Produce this table before writing copy:

| Claim | Proof | Level | Risk |
| --- | --- | --- | --- |
| What we want to say | URL, file, command, or screenshot | L0-L4 | What could be challenged |

If a claim has no proof, either remove it or turn it into a roadmap statement.

## Copy Rules

- Lead with what the project helps people do.
- Mention Codex/OpenAI only where the repo actually supports that surface.
- Keep maintainer-facing copy short and specific.
- Include validation links instead of adjectives.
- Future paid features appear only when they are live and relevant.
- Comparisons against unrelated tools require tested evidence.

## Output

Return exactly these fields. `Status` must be one of `publish`, `improve first`,
`watch`, or `skip`.

```markdown
## Proof-Led OSS Marketing

Status: publish | improve first | watch | skip

### Proof Packet
| Claim | Proof | Level | Risk |
| --- | --- | --- | --- |

### Decision Context
| Field | Value | Source |
| --- | --- | --- |
| Market | developer and open-source maintainer audiences | sourced or defaulted |
| Budget | no paid placement or sponsorship | sourced or defaulted |
| User preference | reputation-safe proof over maximum reach | sourced or defaulted |
| Timing | current repo state on the audit date | sourced or defaulted |
| Constraints | maintainer rules and must-avoid options | sourced or defaulted |
| Ranking criteria | category fit, proof level, maintainer rules, audience size | sourced or defaulted |

### Candidate Channels
| Channel | Fit | Action | Reason |
| --- | --- | --- | --- |

### Copy Draft
[short draft]

### Guardrails
- [specific no-spam or proof limits]
```
