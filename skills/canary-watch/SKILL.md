---
name: canary-watch
description: Use this skill to monitor and verify a deployed URL or public OSS launch surface after releases — checks HTTP endpoints, SSE streams, static assets, console errors, performance regressions, PR queue health, maintainer feedback, and listing-review blockers after deploys, merges, submissions, or dependency upgrades. Smoke / canary / post-deploy / PR-watch verification.
origin: ecc
---

# Canary Watch — Post-Deploy Monitoring

## When to Use

- After deploying to production or staging
- After merging a risky PR
- When you want to verify a fix actually fixed it
- Continuous monitoring during a launch window
- After dependency upgrades
- After submitting EOC or a related OSS project to awesome lists, marketplaces, plugin directories, or community catalogs

## How It Works

Monitors a deployed URL or public launch surface for regressions. Runs in a loop until stopped or until the watch window expires.

## Responsibility Contract

Act as the release or launch canary owner for the monitored surface.

Owned surface:

- deployed URLs and their stated health checks
- public listing PRs and their review state
- the evidence report that explains whether action is needed

Non-goals:

- do not merge PRs
- do not close PRs
- do not argue with maintainers
- do not post public comments from this skill
- do not open new listing PRs from this skill

Required verification:

- cite the exact URL, PR, check, comment, or command output used as evidence
- separate `healthy`, `needs fix`, `needs response`, and `watch only`
- return changed files only when the watch action edited local docs, tests, or skills
- list residual risks, especially maintainer discretion or missing external credentials

## Rule Precedence

When instructions conflict, follow this order:

1. Safety, privacy, repository ownership, and credential boundaries
2. Maintainer instructions and target repository rules
3. Anti-spam and public-comment limits in this skill
4. The user's requested monitoring or launch action
5. Convenience, speed, or marketing reach

Conflict behavior: do not decide silently which instruction wins. If a requested action conflicts with the ordered rules above, stop the action and ask for a separate approval with the conflicting rule named.

This skill has zero public-action carve-outs for comments, PR creation, PR closing, or merging. If those actions are needed, stop this skill after the evidence report and ask for a separate user-approved task. If a PR is healthy, the anti-spam rule wins over any generic desire to "keep it warm".

## Listing Target Decision Context

Before classifying a new public listing target, record:

- target repo and category
- target market or community, such as Codex, coding agents, agent skills, security, or general AI agents
- budget or cost constraint; default is no paid placement and no sponsorship without a later user-approved task
- timing constraint; default is current public repo state on the audit date
- user preference; default is reputation-safe submission over maximum reach
- maintainer repository rules
- evidence that similar projects are accepted there
- reason EOC fits that category
- timing, maturity, and adoption evidence available at the time of review
- rejection risk such as new-project maturity, low adoption, wrong format, or upstream-lineage concerns
- required proof such as README execution model, validation output, install path, stars, users, or prior acceptance
- decision criteria for `submit later`, `watch only`, or `do not submit`

If any of those inputs are missing, classify the target as `watch only`.

## Technical Risk Contract

Before edits, identify the target surface and rollback path.

| Surface | Allowed action | Risk control | Verification |
|---|---|---|---|
| Deployed URL | observe, compare, report | do not mutate production state from this skill | HTTP/browser/API evidence |
| PR body | report the needed edit | make the edit in a separate user-approved task | reread PR body after edit |
| PR comment | prepare a draft only | post only in a separate user-approved task; one focused comment, no repeated pings | link to maintainer request and approved final comment |
| Repository docs/skills | update only when the repo needs durable guidance | keep tests or PromptGuard coverage with the doc change | targeted tests plus PromptGuard for prompt-like files |

If the risk cannot be verified with a command or public artifact, report it as residual risk instead of claiming it is fixed.

### What It Watches

```
1. HTTP Status — is the page returning 200?
2. Console Errors — new errors that weren't there before?
3. Network Failures — failed API calls, 5xx responses?
4. Performance — LCP/CLS/INP regression vs baseline?
5. Content — did key elements disappear? (h1, nav, footer, CTA)
6. API Health — are critical endpoints responding within SLA?
7. Static Assets — are JS, CSS, image, and font requests returning 2xx/3xx with expected content types?
8. SSE Streams — do event-stream endpoints connect and receive an initial event or heartbeat?
9. OSS PR Queue — are submitted listings mergeable, failing checks, or receiving maintainer feedback?
10. Listing Fit — did a maintainer flag wrong category, weak positioning, spam risk, or missing evidence?
```

### Watch Modes

**Quick check** (default): single pass, report results
```
/canary-watch https://myapp.com
```

**Sustained watch**: check every N minutes for M hours
```
/canary-watch https://myapp.com --interval 5m --duration 2h
```

**Diff mode**: compare staging vs production
```
/canary-watch --compare https://staging.myapp.com https://myapp.com
```

**OSS PR queue mode**: monitor public submission health without noisy follow-ups
```
/canary-watch --oss-prs mturac/everything-openai-codex --query "everything-openai-codex author:mturac"
```

### Alert Thresholds

```yaml
critical:  # immediate alert
  - HTTP status != 200
  - Console error count > 5 (new errors only)
  - LCP > 4s
  - API endpoint returns 5xx
  - Static asset returns 4xx/5xx
  - SSE endpoint cannot connect or drops before first heartbeat
  - Submitted PR becomes unmergeable because of conflicts
  - Required CI/status check fails
  - Maintainer asks for a concrete change, CLA action, category move, or evidence update

warning:   # flag in report
  - LCP increased > 500ms from baseline
  - CLS > 0.1
  - New console warnings
  - Response time > 2x baseline
  - Static asset content type changed unexpectedly
  - SSE heartbeat latency > 2x baseline
  - PR is silently closed without explanation
  - Reviewer says positioning is unclear, too broad, or too close to an upstream project
  - PR body lacks a project link, execution model, validation note, or exact category rationale

info:      # log only
  - Minor performance variance
  - New network requests (third-party scripts added?)
  - Open PR is mergeable with no failed or pending checks
  - Closed duplicate PR has a newer replacement already open
```

### Notifications

When a critical threshold is crossed:
- Desktop notification (macOS/Linux)
- Optional: Slack/Discord webhook
- Log to `~/.codex/canary-watch.log`

## OSS PR Queue Workflow

Use this mode when the launch risk is a public submission trail rather than a deployed endpoint.

### 1. Read the Current Queue

Use GitHub state, not memory:

```bash
gh search prs "everything-openai-codex" --author mturac --state open --json url,repository,title,updatedAt --limit 100
gh search prs "everything-openai-codex" --author mturac --state closed --json url,repository,title,updatedAt --limit 100
```

For each open PR, inspect:

```bash
gh pr view <number> --repo <owner/repo> --json mergeable,statusCheckRollup,comments,reviews,body,title,url
```

### 2. Classify the PR

| State | Meaning | Action |
|---|---|---|
| Healthy | mergeable, no failed/pending checks, body links to project and execution model | do not comment |
| Needs fix | failed check, merge conflict, CLA blocker, invalid category, broken link | fix or update the PR |
| Needs response | maintainer asks a concrete question or requests a change | answer once with evidence |
| Closed duplicate | intentionally superseded by another PR | no action |
| Closed reject | maintainer says the project does not fit | learn from it, do not argue |
| Silent close | closed with no comments | record as closed; no chase comments |

### 3. Anti-Spam Rule

Do not post "any update?" comments, repeated pings, or generic follow-ups. A public launch canary may draft a response when maintainer feedback needs an answer. Posting that draft requires a separate approval decision.

Public PR body edits are lower risk than comments and still need evidence. Edit a body only when the change materially improves review context, such as fixing a broken link, category rationale, validation note, or execution-model context.

### 4. Positioning Gate

Before adding a new listing PR, verify:

- the repo category accepts projects like this one
- there is no existing open or closed submission for the same target
- the PR body names the project, category, public repo URL, and validation performed
- the project is not being forced into a subagent-only, skill-only, research-only, or commercial-directory list
- the submission explains the EOC execution model, not only the asset count

If a well-known repo has a higher bar such as "proven/community-adopted skills", do not submit until the project has evidence that matches that bar.

## Output

```markdown
## Canary Report — myapp.com — 2026-03-23 03:15 PST

### Status: HEALTHY ✓

| Check | Result | Baseline | Delta |
|-------|--------|----------|-------|
| HTTP | 200 ✓ | 200 | — |
| Console errors | 0 ✓ | 0 | — |
| LCP | 1.8s ✓ | 1.6s | +200ms |
| CLS | 0.01 ✓ | 0.01 | — |
| API /health | 145ms ✓ | 120ms | +25ms |
| Static assets | 42/42 ✓ | 42/42 | — |
| SSE /events | connected ✓ | connected | +80ms heartbeat |

### No regressions detected. Deploy is clean.
```

```markdown
## OSS PR Canary — everything-openai-codex — 2026-05-19

### Status: CLEAN

| Queue | Count | Notes |
|---|---:|---|
| Open PRs | 22 | all mergeable |
| Failed checks | 0 | no action |
| Pending checks | 0 | no action |
| Maintainer blockers | 0 | no action |
| Closed rejects | 1 | recorded; do not argue |

### Action

No comments needed. Keep monitoring for concrete maintainer feedback or CI failures.
```

## Integration

Pair with:
- `/browser-qa` for pre-deploy verification
- Hooks: add as a PostToolUse hook on `git push` to auto-check after deploys
- CI: run in GitHub Actions after deploy step
- `scripts/work-items.js` for syncing GitHub PR/issue queue state into the local status surface
- `automation-audit-ops` when PR monitoring overlaps with launch, CI, hook, or marketplace automation
