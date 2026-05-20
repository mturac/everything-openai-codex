# Everything OpenAI Codex Go-To-Market

## Audience

Primary users are Codex power users, AI coding workflow builders, devtools maintainers, prompt and agent system collectors, and teams trying to make agent sessions repeatable across Codex, Cursor, OpenCode, Zed, Copilot, and adjacent harnesses.

## Constraints

- No paid ads for the first push.
- No spam blasts or generic directory stuffing.
- Lead with evidence: screenshots, install dry-run, release notes, and the public review guide.
- Use one high-fit post or PR per channel, then respond to feedback instead of reposting.
- Promote the repo-marketplace plugin path first; treat npm as optional packaging, not the primary launch story.

## Launch Phases

| Phase | Goal | Actions | Exit signal |
|---|---|---|---|
| 0. Launch polish | Make the repo easy to share | Keep the plugin path first, keep source install as fallback, refresh screenshots, keep counts test-backed | A new user can evaluate from plugin or clone without confusion |
| 1. Soft launch | Get expert feedback | OpenAI Developer Community, r/codex, direct devtools friends, GitHub Discussions | Specific feedback on install clarity, safety, and catalog shape |
| 2. Directory pass | Add durable discovery | ToolHunter, OSS AI Hub, OpenForK, ForgeIndex, Project Free To Use, StackScout | Accepted listings or clear rejection notes |
| 3. Technical article | Explain the system | Dev.to article on the operator loop and cross-harness adapter model | Reusable article link for directory submissions |
| 4. Broad launch | Larger attention push | Show HN and Product Hunt | Only after install channels, screenshots, and demo proof are polished |

## Channel Priority

| Priority | Channel | Angle | Timing |
|---|---|---|---|
| P0 | GitHub repo metadata | Add precise topics: `openai-codex`, `codex`, `ai-agents`, `developer-tools`, `workflow-automation`, `agentic-coding`, `mcp`, `cursor`, `opencode` | Immediately |
| P0 | README and launch kit | Plugin-first install, source fallback, clear screenshots | Immediately |
| P1 | OpenAI Developer Community | "How I make Codex sessions repeatable" | After source dry-run proof |
| P1 | Reddit r/codex | Feedback request, not a launch brag | After source dry-run proof |
| P1 | Dev.to | Technical walkthrough of Intake -> Route -> Plan -> Execute -> Verify -> Capture -> Resume | After README cleanup |
| P2 | Awesome lists | Submit only to lists that accept workflow systems, not generic AI directories | After adoption or external feedback |
| P2 | OSS directories | Short directory copy from launch kit | After screenshots are confirmed |
| P3 | Show HN | "Show HN" with the plugin path, source fallback, and screenshots | After the soft launch feedback pass |
| P3 | Product Hunt | Polished launch with screenshots, demo, and short video | After external validation |

## Immediate Checklist

- Keep `/plugin marketplace add ...` and `/plugin install eoc@eoc` as the first install path.
- Decide later whether npm registry distribution matters for the launch; it is not required for Codex plugin adoption.
- Add or refresh screenshots under `assets/screenshots/`.
- Run `npm pack --dry-run` before public submission.
- Keep the public review guide linked in every directory submission.

## Positioning

One-line:

> Open-source operating system for serious OpenAI Codex workflows.

Longer:

> Everything OpenAI Codex turns a raw Codex setup into a repeatable engineering workspace with scoped instructions, reusable skills, hook gates, memory patterns, install profiles, and cross-harness adapters.
