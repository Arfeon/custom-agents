# AGENTS.md

This file provides **global AI agent instructions** for this repository. It is read on demand by any AI coding tool (Claude Code, Cursor, GitHub Copilot, etc.) to understand how to work in this codebase.

> **Scope**: universal — works with any AI tool.
> **VS Code Copilot users**: `.github/copilot-instructions.md` is auto-loaded for all conversations (no manual action needed). This file adds coverage for non-VS Code tools.
>
> For monorepos: subdirectory `AGENTS.md` files are merged with this root file for package-specific overrides.

---

## Project Context

<!-- PROJECT_DESCRIPTION: Fill in with your project's description -->
<!-- TECH_STACK: Fill in with your main technologies -->
<!-- ARCHITECTURE: Fill in with your architecture pattern (e.g., Clean Architecture, Hexagonal, MVC) -->

---

## Available Agents

Agents live in `.github/agents/`. Call them with `@agent-name` in Copilot Chat.

| Agent | Call | Use when... |
|---|---|---|
| `feedback.md` | `@feedback` | Default mode for any task. Enforces iterative feedback loop. Start here. |
| `architect.md` | `@architect` | Architecture design, design pattern selection, SOLID/DRY refactoring. |
| `guardian.md` | `@guardian` | Post-implementation review: security, edge cases, test coverage. |
| `devops.md` | `@devops` | CI/CD pipelines, Dockerfiles, Kubernetes, IaC, deployment strategy. |

---

## Available Skills

Load a skill with `readFile("skills/<name>/SKILL.md")` before responding to relevant tasks.

| Skill | Load when... |
|---|---|
| `skills/agent-delegation/SKILL.md` | Deciding which agent to invoke and what to pass it. |
| `skills/design-patterns/SKILL.md` | Complexity, variability, or extensibility concern detected. |
| `skills/code-architecture/SKILL.md` | Structuring a module, detecting architecture, deciding where logic belongs. |
| `skills/context7/SKILL.md` | Any library/framework/package API question. Never answer from memory. |
| `skills/debugging/SKILL.md` | Bug, error, or unexpected behavior reported by the user. |
| `skills/api-design/SKILL.md` | Designing or reviewing REST endpoints, HTTP handlers. |
| `skills/testing/SKILL.md` | Writing tests or identifying coverage gaps. |
| `skills/git-workflow/SKILL.md` | Commits, branches, PRs, merging, versioning. |
| `skills/observability/SKILL.md` | Logging, metrics, tracing, monitoring. |
| `skills/resilience-patterns/SKILL.md` | External API calls, fault tolerance, retries, circuit breakers. |

---

## Implementation Workflow

Every code change follows this sequence:

```
1. [Architect]  — if design or structural decisions are involved
2. Implement    — write or modify code
3. [Guardian]   — mandatory post-implementation review before presenting to user
4. Present      — show result + Guardian findings
```

**Guardian is not optional after implementing.** It runs security + edge case + test coverage checks.

---

## Quality Standards

These apply unconditionally to all code in this repository:

1. **SOLID** — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.
2. **DRY** — if written twice, abstract it.
3. **Naming over comments** — code must be self-explanatory.
4. **Pure functions** — minimize side effects. Predictable > magical.
5. **Immutability by default** — mutate only when there is a clear reason.
6. **Security at every layer** — validate all external input, never log sensitive data, least privilege.
7. **Minimum complexity** — do not add abstractions unless they solve a real problem today.

---

## Constraints

- **Do NOT build or run code** unless explicitly instructed.
- **Do NOT write tests** unless explicitly instructed or Guardian identifies coverage gaps.
- **Do NOT write documentation** unless explicitly instructed.
- Read relevant files before modifying them.
- Check existing architecture before proposing changes.
- When uncertain about design: invoke `Architect`.
- When uncertain about security: invoke `Guardian`.
