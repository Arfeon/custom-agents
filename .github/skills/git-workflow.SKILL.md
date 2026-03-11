# Skill: Git Workflow & Conventional Commits

## Invocation
```
readFile: skills/git-workflow.SKILL.md
```
Load this skill when the user asks about commits, branches, PRs, merging, or version tagging.

---

## Trigger Conditions
- User asks how to name a branch or commit
- User asks about PR creation, merge strategy, or rebasing
- User asks about versioning or tagging a release
- User needs help writing a commit message

---

## Branch Naming

```
<type>/<short-description-in-kebab-case>
```

| Type | When |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Maintenance, deps |
| `refactor/` | Code restructure (no behavior change) |
| `docs/` | Documentation only |
| `test/` | Adding/fixing tests |
| `hotfix/` | Emergency production fix |

Examples: `feat/user-auth`, `fix/null-ptr-login`, `hotfix/payment-crash`

---

## Conventional Commits

```
<type>(<scope>): <subject>

[body — explain WHY, not WHAT]

[footer: BREAKING CHANGE / Closes #issue]
```

**Subject line rules**:
- Imperative mood: "add", not "added" or "adds"
- Max 72 chars, no period at end
- Lowercase type and scope

**Examples**:
```
feat(auth): add JWT refresh token rotation

fix(api): prevent null dereference on empty user list
Closes #142

chore(deps): upgrade express 4.18 → 5.0
BREAKING CHANGE: app.listen() now returns a promise
```

---

## Merge Strategy

| Strategy | Use when |
|---|---|
| **Squash merge** | Feature branch → main (clean history) |
| **Rebase merge** | Small atomic branch where commit history matters |
| **Merge commit** | Long-lived release/develop branches |

**Default recommendation**: squash merge PRs into `main`. Feature branch commits can be messy.

---

## SemVer Tagging

```
MAJOR.MINOR.PATCH
```

| Bump | When |
|---|---|
| PATCH `1.0.1` | Bug fix, no API change |
| MINOR `1.1.0` | New feature, backward compatible |
| MAJOR `2.0.0` | Breaking change |

Tag: `git tag -a v1.2.0 -m "Release 1.2.0"`

---

## Pre-PR Checklist
- [ ] Branch up to date with `main`
- [ ] All commits follow Conventional Commits
- [ ] No `console.log`, debug code, or leftover `TODO`s
- [ ] PR description covers what + why + issue link
