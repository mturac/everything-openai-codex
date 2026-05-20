# EOC Product Improvement Backlog

This backlog focuses on making Everything OpenAI Codex easier to install,
evaluate, navigate, trust, and extend. Public launch work should follow this
product proof, not outrun it.

## Product Principles

- Plugin-first adoption: keep the Codex plugin marketplace path as the primary
  install route, with source install as the reproducible fallback.
- Evidence before promotion: every public claim should map to a command, test,
  screenshot, release note, or review guide.
- Operator speed: a new user should reach a useful EOC workflow in less than
  ten minutes.
- Quiet trust: health checks, repair commands, and release gates should explain
  the next action without requiring a maintainer to decode logs.

## Now

| Status | Area | Improvement | Success signal | Evidence command |
|---|---|---|---|---|
| Open | Activation | Add a first-ten-minutes path that starts from plugin install, source dry-run, catalog browse, and doctor output | A new evaluator can complete the path without reading the full README | `node scripts/install-apply.js --profile minimal --target codex --dry-run` |
| Shipped | Install health | Make `ecc doctor` print the recommended repair command beside each issue | Doctor output moves from diagnosis to guided recovery | `node scripts/ecc.js doctor --target codex` |
| Shipped | Catalog discovery | Add keyword search to `ecc catalog` for skills, agents, rules, profiles, and install modules | Users can find "review", "security", "frontend", or "memory" without browsing directories | `node scripts/ecc.js catalog search security` |
| Shipped | Demo proof | Add a single local smoke command that verifies source dry-run, catalog, doctor, and status basics | Maintainers can refresh demo confidence before posting or submitting | `npm run demo:smoke` |
| Open | README routing | Keep README short-path navigation pointed at product proof, review guide, release notes, and go-to-market | Visitors know where to evaluate, where to trust, and where to contribute | `node tests/docs/public-positioning.test.js` |

## Next

| Area | Improvement | Success signal | Evidence command |
|---|---|---|---|
| Dashboard | Surface install health, catalog search, copyable commands, and readiness status in the dashboard | The dashboard becomes an evaluator surface, not only an operator surface | `npm run dashboard` |
| Screenshots | Refresh the four public screenshots after the first-ten-minutes path is stable | Screenshots match the current plugin-first story | Manual screenshot review against `assets/screenshots/` |
| Package channels | Reconcile plugin marketplace naming, source install, and scoped npm package expectations | No visitor sees conflicting `eoc`, `ecc`, or package-channel language | `node tests/docs/install-identifiers.test.js` |
| Contribution path | Add issue templates for install failure, catalog request, skill contribution, and docs correction | Incoming feedback lands as actionable work instead of vague issues | `gh issue list --repo mturac/everything-openai-codex` |
| Release gate | Add clean-checkout smoke guidance for maintainers before broad launch | Public pushes use the same repeatable checklist | `npm pack --dry-run` |

## Later

| Area | Improvement | Success signal | Evidence command |
|---|---|---|---|
| Examples gallery | Publish five workflow cards: code review, security scan, long task resume, frontend design, backend TDD | Users pick a workflow by intent before learning repo structure | Docs test for linked examples |
| Localized parity | Add docs parity checks for translated READMEs when install paths change | Translations do not drift on install commands or product claims | `npm run test` |
| Dogfood report | Publish a weekly dogfood note with what EOC improved inside its own repo | The project shows its operating loop, not only its catalog size | Manual release note entry |
| Adoption metrics | Track stars, forks, issues, plugin install feedback, review-guide completions, and accepted listings | Growth is judged by durable usage signals, not raw posting volume | GitHub and submission ledger review |

## Product Metrics

| Metric | Target | Why it matters |
|---|---|---|
| Time to first useful workflow | Under 10 minutes | Measures whether the repo is approachable without maintainer guidance |
| Source dry-run success | 100% on clean checkout | Protects the fallback install path |
| Doctor actionability | Every issue includes a fix command or next file to inspect | Turns support into self-service |
| Catalog findability | Top intents return relevant surfaces from one command | Makes 232 skills navigable |
| Public proof freshness | Screenshots, release notes, launch kit, and review guide agree | Keeps promotion aligned with the live repo |
| High-severity dependency audit | 0 high findings | Preserves trust for installable tooling |

## Operating Rule

Before broad public pushes, complete at least one item from **Now** and attach
the evidence command output to the launch or release note. The repo should earn
attention by becoming easier to use each time it is shared.
