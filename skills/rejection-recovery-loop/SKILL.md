---
name: rejection-recovery-loop
description: Turn public launch, directory, community, or list rejections into repo fixes and better proof without arguing, spamming, or resubmitting blindly. Use after Hacker News, Product Hunt, GitHub list PR, marketplace, or community rejection.
origin: eoc
---

# Rejection Recovery Loop

Use this skill when a public submission, listing PR, community post, launch
surface, or marketplace attempt is rejected, closed, ignored, or blocked.

The goal is not to "win the argument." The goal is to learn exactly what failed,
fix the project surface when the criticism is valid, and decide whether to
resubmit, wait, or stop.

## Rule Precedence

Follow this order when instructions conflict:

1. Safety, privacy, credentials, and target-platform rules
2. No-bypass and no-spam boundaries in this skill
3. Exact rejection evidence
4. User-requested distribution goals
5. Copy style and timing preferences

Public-action carve-outs: zero inside this skill for reposting, new-account
workarounds, duplicate PRs, public replies, form submissions, or account
changes. This skill always stops at a recovery report and optional response
draft.

Allowed action carve-outs: zero inside this skill.

Conflict behavior: when a requested action conflicts with the ordered rules
above, stop after the recovery report and name the conflicting rule.

This skill does not define or call tools directly. If tools are needed, use only
the active runtime tool schema and treat missing authentication, hidden
moderation state, or unclear rejection text as residual risk.

## Blocked Actions

- arguing with maintainers or moderators
- reposting the same submission with cosmetic wording changes
- creating a new account, new PR, or new thread to bypass a rejection
- treating silence as permission to ping repeatedly
- hiding lineage, upstream adaptation, or project maturity

## Technical Risk Contract

Before editing repo files, identify the rejected surface, target repo files, and
rollback path.

Allowed edits from this skill are limited to durable recovery surfaces such as
README copy, attribution notes, screenshots, public-review docs, release notes,
skills, and tests that verify the corrected claim.

Excluded technical changes from this skill:

- product behavior
- form submissions
- posted comments
- new listing PRs
- account changes

Verification must include the relevant docs tests, catalog checks when counts
change, PromptGuard for prompt-like files, and a final diff summary.

## Classification

Classify the rejection before taking action:

| Type | Signal | Meaning |
| --- | --- | --- |
| Account gate | permission or eligibility block | account-state blocker |
| Category mismatch | wrong list, wrong section, not enough fit | target-fit blocker |
| Proof gap | asks for users, screenshots, validation, install proof | evidence blocker |
| Quality gap | broken README, unclear install, bad screenshots, CI failure | repo-quality blocker |
| Duplicate | existing PR, existing item, replacement thread | duplicate blocker |
| Policy gate | commercial, affiliate, AI-spam, self-promo rules | policy blocker |
| Maintainer request | concrete requested change | response-worthy blocker |
| Silent close | closed without reason | unverifiable close |

## Workflow

1. Capture evidence.
   - Save the exact rejection text, URL, timestamp, and actor if available.
   - Link the submitted copy, PR body, screenshots, and target rules.
2. Find the smallest truthful fix.
   - README clarity
   - install command accuracy
   - screenshots or demo evidence
   - category rationale
   - attribution and upstream lineage
   - CI, audit, or package evidence
3. Decide the next move.
   - `fix and respond`: maintainer asked for a concrete change.
   - `fix and wait`: repo surface was weak but no response is needed.
   - `resubmit later`: target fit is real, but proof is not ready.
   - `skip permanently`: target rules or audience fail to fit.
4. Produce a response draft only when response is justified.

## Response Rules

A response is justified only when:

- the maintainer asked a concrete question
- a broken link or factual issue was fixed
- a CLA or category instruction needs one clear answer
- the target explicitly invites resubmission after changes

Keep it to one comment. Cite the fix. Avoid asking for special treatment.

## Output

Return exactly these fields. `Status` must be one of `fix and respond`,
`fix and wait`, `resubmit later`, or `skip permanently`.

```markdown
## Rejection Recovery

Status: fix and respond | fix and wait | resubmit later | skip permanently

### Evidence
| Item | Link or Quote | Meaning |
| --- | --- | --- |

### Classification
[type and reason]

### Repo Fixes
- [specific file, asset, CI, or docs fix]

### Response Draft
[only if justified]

### Residual Risk
- [moderator discretion, maturity gap, missing adoption proof]
```
