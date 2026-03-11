# Skill: Context7 — Up-to-date Library Documentation

## Invocation
```
readFile: skills/context7.SKILL.md
```
Load this skill **before answering any question about a library, framework, or package.** Training data is stale. This is not optional.

---

## Trigger Conditions
- User asks how to use a specific library/package API
- User asks about a method, parameter, or option of a library
- User migrates from one version to another
- User has an import error or unexpected behavior with a dependency
- User asks "is X still supported" or "what's the latest way to do Y with Z"

---

## Workflow (execute in order, no skipping)

### Step 1 — Resolve the library ID
```
Tool: mcp_context7_resolve-library-id
Args: { "libraryName": "<exact name from user>" }
```
> Multiple results? Pick highest `trustScore`. Match the user's ecosystem (npm/PyPI/etc.).

### Step 2 — Fetch targeted docs
```
Tool: mcp_context7_get-library-docs
Args: {
  "context7CompatibleLibraryID": "<id from Step 1>",
  "topic": "<specific topic: e.g. 'streaming', 'authentication', 'hooks'>",
  "tokens": 5000
}
```
> Start at 5000 tokens. Use 8000 for complex topics. Be specific with `topic` — narrow beats broad.

### Step 3 — Answer from docs only
Base your response **exclusively** on the fetched content. If docs don't cover it, say so. Never guess from memory.

---

## Efficiency Rules
- One `resolve-library-id` per library per session — reuse the resolved ID.
- Multiple libraries? Resolve both in parallel, then fetch docs for each.
- Empty/thin docs? Retry with broader topic or +3000 tokens before giving up.
