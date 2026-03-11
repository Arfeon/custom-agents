# copilot-agents

A team of specialized AI agents and domain skill files for GitHub Copilot. Install once, use across all projects.

---

## What's Included

### Agents

Four agents, each with a focused role:

| Agent | How to call | Purpose |
|---|---|---|
| **feedback** | `@feedback` | Main orchestrator. Enforces MCP feedback loop on every response. Start here for any task. |
| **architect** | `@architect` | Senior Software Architect. Design patterns, SOLID/DRY enforcement, refactoring. |
| **guardian** | `@guardian` | Post-implementation evaluator. Security audit, edge cases, test coverage gaps. |
| **devops** | `@devops` | Infrastructure engineer. CI/CD, Dockerfiles, Kubernetes, IaC, secret management. |

### Skills

On-demand knowledge files loaded via `readFile()`. Each skill activates specialized behavior when a trigger condition is detected.

| Skill | Trigger |
|---|---|
| `agent-delegation` | Deciding which agent to invoke |
| `design-patterns` | Complexity, variability, or extensibility concerns |
| `code-architecture` | Structuring modules, detecting layers, placing logic |
| `context7` | Any library or framework API question |
| `debugging` | Bug, error, or unexpected behavior |
| `api-design` | Designing or reviewing REST endpoints |
| `testing` | Writing tests or identifying coverage gaps |
| `git-workflow` | Commits, branches, PRs, versioning |
| `observability` | Logging, metrics, tracing, monitoring |
| `resilience-patterns` | External APIs, retries, circuit breakers |

---

## Installation

### Via npx from GitHub

```bash
npx github:Arfeon/custom-agents
```

Run this command from the root of any project. No npm publish required.

### What gets installed

```
your-project/
├── AGENTS.md                      ← universal AI context (read by any AI tool)
├── .github/
│   ├── copilot-instructions.md    ← VS Code Copilot global rules
│   ├── copilot-agents.md          ← agents & skills reference
│   ├── feedback.agent.md          ← VS Code mode picker
│   ├── architect.agent.md         ← VS Code mode picker
│   ├── guardian.agent.md          ← VS Code mode picker
│   ├── devops.agent.md            ← VS Code mode picker
│   └── agents/
│       ├── feedback.md            ← @feedback (Copilot Chat)
│       ├── architect.md           ← @architect
│       ├── guardian.md            ← @guardian
│       └── devops.md              ← @devops
└── skills/
    └── *.SKILL.md
```

---

## Usage

### In Copilot Chat — call by name

```
@feedback implement the user authentication module
@architect review this service for SOLID violations
@guardian evaluate the code I just wrote
@devops set up a GitHub Actions pipeline for this project
```

### In VS Code — select from the mode picker

Open the agent mode dropdown in the Copilot chat panel and select `feedback`, `architect`, `guardian`, or `devops`.

### Skills — loaded automatically by agents

Agents load skill files when trigger conditions are detected. You can also load them manually:

```
readFile("skills/debugging.SKILL.md")
```

---

## Workflow

Every implementation follows this sequence:

```
1. [Architect]  — if design or structural decisions are needed
2. Implement    — write or modify code
3. [Guardian]   — mandatory post-implementation review
4. MCP call     — interactive_feedback to present result to user
```

Guardian is not optional. It runs after every implementation before the result is shown.

---

## Requirements

- VS Code with GitHub Copilot extension
- Node.js ≥ 18 (for the installer)
- MCP feedback server (`mcp-feedback-enhanced`) for the `@feedback` agent loop
