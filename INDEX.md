# Agents & Skills Index

## Agents

| Agent | Source file | Call | Role |
|---|---|---|---|
| **Feedback** | `feedback.agent.md` | `@feedback` | Main orchestrator. Enforces MCP feedback loop. Entry point for all tasks. |
| **Architect** | `Architect.agent.md` | `@architect` | Senior Software Architect. Design patterns, SOLID, refactoring, code structure. |
| **Guardian** | `Guardian.agent.md` | `@guardian` | Code evaluator. Post-implementation security audit, edge cases, test coverage gaps. |
| **DevOps** | `DevOps.agent.md` | `@devops` | Infrastructure engineer. CI/CD, IaC, containers, deployments, secret management. |

---

## Skills

Skills are knowledge files loaded on-demand via `readFile`. They inject instructions into the active agent.

### Orchestration

| Skill | File | Purpose |
|---|---|---|
| **Agent Delegation** | `skills/agent-delegation.SKILL.md` | When and how to invoke each agent. Decision tree, context to pass, chaining patterns. |

### Architecture & Patterns

| Skill | File | Purpose |
|---|---|---|
| **Design Patterns** | `skills/design-patterns.SKILL.md` | GoF patterns (Creational / Structural / Behavioral). When to use each. Anti-patterns. |
| **Code Architecture** | `skills/code-architecture.SKILL.md` | Layered, Clean Architecture, Hexagonal, DDD. Placement rules for every type of logic. |

### Development

| Skill | File | Purpose |
|---|---|---|
| **Context7** | `skills/context7.SKILL.md` | Fetch live library docs via Context7 MCP. Never answer library questions from memory. |
| **Debugging** | `skills/debugging.SKILL.md` | 5-phase debugging protocol: understand → locate → diagnose → fix → validate. |
| **API Design** | `skills/api-design.SKILL.md` | REST: HTTP methods, status codes, pagination, response envelopes, security checklist. |
| **Testing** | `skills/testing.SKILL.md` | Unit/integration/e2e strategy, AAA pattern, mocking/doubles, edge cases checklist. |
| **Git Workflow** | `skills/git-workflow.SKILL.md` | Conventional Commits, branch naming, merge strategies, SemVer tagging. |

### Infrastructure

| Skill | File | Purpose |
|---|---|---|
| **Observability** | `skills/observability.SKILL.md` | Structured logging, metrics (Prometheus), OpenTelemetry tracing, SLI/SLO. |
| **Resilience Patterns** | `skills/resilience-patterns.SKILL.md` | Timeout, Retry+backoff+jitter, Circuit Breaker, Bulkhead, Rate Limiter, Fallback. |

---

## Installed Structure (after `npx copilot-agents`)

When installed into a project, files are placed as follows:

```
my-project/
├── AGENTS.md                          ← universal AI instructions (root, read by ALL AI tools)
├── .github/
│   ├── copilot-instructions.md        ← VS Code Copilot base config (applied globally)
│   ├── copilot-agents.md              ← this index (reference)
│   ├── feedback.agent.md              ← VS Code mode picker (selectable from dropdown)
│   ├── architect.agent.md             ← VS Code mode picker
│   ├── guardian.agent.md              ← VS Code mode picker
│   ├── devops.agent.md                ← VS Code mode picker
│   └── agents/                        ← GitHub Copilot Chat @agent-name
│       ├── feedback.md                 (@feedback)
│       ├── architect.md                (@architect)
│       ├── guardian.md                 (@guardian)
│       └── devops.md                   (@devops)
└── skills/
    └── *.SKILL.md
```

**Two agent systems, both installed:**
- **`.github/agents/*.md`** — GitHub Copilot Chat convention (`@feedback`, `@architect`, etc.)
- **`.github/*.agent.md`** — VS Code Copilot mode picker (selectable from the agent dropdown)

Both systems use the same agents — same instructions, different entry points.

---

## Implementation Workflow

```
1. [Architect]  — if structural/design decisions are needed
2. Implement    — write or modify code
3. [Guardian]   — mandatory post-implementation evaluation (security + edge cases + tests)
4. MCP call     — mcp_mcp-feedback-_interactive_feedback (timeout: 3600)
```

## How to Use a Skill

```
readFile("skills/<skill-name>.SKILL.md")
→ read the Trigger Conditions
→ if triggered, follow its instructions before responding
```

## Installation

```bash
npx copilot-agents           # from npm (once published)
npx github:<user>/agents     # directly from GitHub
```
