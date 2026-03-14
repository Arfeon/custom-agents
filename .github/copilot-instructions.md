# Copilot Instructions

> **This file is automatically loaded by VS Code Copilot for every conversation in this workspace.**
> It defines default behavior, quality standards, and the available agents and skills.
>
> This is NOT a substitute for `AGENTS.md` (project root). Each serves a different audience:
> - `copilot-instructions.md` → VS Code Copilot only, auto-applied, always active
> - `AGENTS.md` → universal, read by any AI tool (Claude Code, Cursor, etc.) on demand

This workspace is a **VS Code Copilot agent configuration system** for professional software development projects.

---

## Agents Available

The following custom agents are configured for this workspace. See [INDEX.md](../INDEX.md) for full details.

| Agent | Select when... |
|---|---|
| `feedback` | Default mode for any development task. Enforces implementation workflow + MCP feedback loop. |
| `Architect` | Architecture review, design pattern selection, or refactoring. |
| `Guardian` | Post-implementation security audit, edge case analysis, test coverage gaps. |
| `DevOps` | CI/CD pipelines, infrastructure, containers, deployments. |

---

## Skills Available

Load a skill with `readFile("skills/<name>/SKILL.md")` **before responding OR before performing** any action covered by that skill. Full list: [INDEX.md](../INDEX.md).

> **Rule**: if you are about to do a git commit, call a library API, design an endpoint, or implement a pattern — load the relevant skill first, even if the user didn't explicitly ask about it.

Quick reference:

| Need | Load |
|---|---|
| Library/framework docs | `skills/context7/SKILL.md` |
| Design pattern selection | `skills/design-patterns/SKILL.md` |
| Project structure / architecture | `skills/code-architecture/SKILL.md` |
| Debugging a bug or error | `skills/debugging/SKILL.md` |
| REST API design or review | `skills/api-design/SKILL.md` |
| Writing tests | `skills/testing/SKILL.md` |
| Logging / metrics / tracing | `skills/observability/SKILL.md` |
| Fault tolerance / retries | `skills/resilience-patterns/SKILL.md` |
| Which agent to invoke | `skills/agent-delegation/SKILL.md` |
| Git commits / branches / PRs | `skills/git-workflow/SKILL.md` |

---

## Universal Quality Standards

These apply to ALL code in ALL projects, regardless of language or framework:

1. **SOLID principles**: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.
2. **DRY**: if written twice, abstract it.
3. **Naming over comments**: code must be self-explanatory. A comment means the name failed.
4. **Pure functions over side effects**: predictable > magic.
5. **Immutability by default**: mutate only when there is a clear reason.
6. **Security at every layer**: validate all external input, never log sensitive data, least privilege always.
7. **Minimum viable complexity**: do not add abstractions, patterns, or indirection unless they solve a real problem today.

---

## Constraints

- **Do NOT build or run code** unless explicitly instructed.
- **Do NOT write tests** unless explicitly instructed or Guardian identifies coverage gaps.
- **Do NOT write documentation/README** unless explicitly instructed.
- Always read relevant files before modifying them.
- Always check existing architecture before proposing a new one.
