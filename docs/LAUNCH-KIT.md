# Everything OpenAI Codex Launch Kit

Everything OpenAI Codex is an open-source workflow system for OpenAI Codex users. It packages agents, skills, commands, hooks, memory patterns, install profiles, and validation checks into one repeatable engineering environment.

## Short Copy

Everything OpenAI Codex turns a raw Codex setup into a repeatable engineering workspace: agents, skills, command shims, hooks, memory, safety checks, and cross-harness adapters in one MIT-licensed repo.

## One-Line Copy

Open-source operating system for serious OpenAI Codex workflows.

## Links

- GitHub: <https://github.com/mturac/everything-openai-codex>
- Plugin install: `/plugin marketplace add https://github.com/mturac/everything-openai-codex` then `/plugin install eoc@eoc`
- Source install: `git clone https://github.com/mturac/everything-openai-codex.git && cd everything-openai-codex && npm install && node scripts/install-apply.js --profile minimal --target codex --dry-run`
- Screenshots: `assets/screenshots/`
- Hero image: `assets/hero.png`
- Current surface counts: see the release notes or run the repository validation checks before quoting numbers externally.
- Go-to-market plan: [GO-TO-MARKET.md](GO-TO-MARKET.md)

## Suggested Tags

`openai-codex`, `codex`, `codex-plugins`, `ai-agents`, `developer-tools`, `coding-assistant`, `cli-tools`, `workflow-automation`, `open-source`, `agent-skills`

## Submission Targets

Queue status and rejection notes are tracked in the dated [public PR queue snapshot](public-pr-queue-2026-05-20.md).

| Target | Fit | Submission path | Notes |
|---|---|---|---|
| ToolHunter | Developer tools and AI agents | <https://www.toolhunter.cc/submit> | Manual review, developer relevance required. |
| OSS AI Hub | Open-source AI tools and agents | <https://ossaihub.com/submit> | Good OSS directory fit. |
| OpenForK | Open-source AI registry | <https://openfork.dev/> | Paste GitHub URL into the Add Tool flow. |
| ForgeIndex | Local/open-source AI projects | <https://forgeindex.ai/> | Google Form asks for project name, description, tags, GitHub URL, and optional demo. |
| Project Free To Use | Free tools, APIs, OSS projects | <https://projectfreetouse.com/submit> | Reviewed before publishing. |
| StackScout | AI developer tools | <https://stackscout.dev/> | Best angle: AI code assistants or agent frameworks. |
| Awesome AI Agents | GitHub awesome list | <https://github.com/kyrolabs/awesome-agents> | Closed silently on 2026-05-19; do not retry without new adoption evidence. |
| Awesome AI Software Development Agents | GitHub awesome list | <https://github.com/flatlogic/awesome-ai-software-development-agents> | Submit by PR with clear description. |
| Reddit r/codex | Codex users | <https://www.reddit.com/r/codex/> | Use a Show-and-Tell post after plugin PR is stable. |
| Dev.to | Developer launch article | <https://dev.to/> | Publish a technical walkthrough, not a product pitch. |

## Directory Description

Everything OpenAI Codex is an MIT-licensed workflow system for OpenAI Codex. It bundles agents, skills, commands, hooks, memory patterns, install profiles, and validation checks so developers can run safer, more repeatable Codex sessions across real repositories.

## Reddit / Community Draft

I packaged my Codex workflow system as an open-source repo: Everything OpenAI Codex.

It is not a prompt dump. It ships agents, skills, commands, hooks, install profiles, memory patterns, and validation checks that I use for real coding work. The current rc.1 surface includes 60 agents, 232 skills, and 75 command shims.

```bash
/plugin marketplace add https://github.com/mturac/everything-openai-codex
/plugin install eoc@eoc
```

Repo: <https://github.com/mturac/everything-openai-codex>

I am looking for feedback from Codex users on what should be smaller, clearer, or safer before calling the public package stable.
