# Skill: Systematic Debugging

## Invocation
```
readFile: skills/debugging/SKILL.md
```
Load this skill when the user reports a bug, error, or unexpected behavior.

---

## Trigger Conditions
- User says "it's not working", "I get an error", "why does X happen"
- Stack trace or exception is shared
- Behavior differs between environments (works locally, fails in prod)
- A recent change broke something that was previously working

---

## Debugging Protocol

### Phase 1 — Understand before touching code
1. Read the full error message — stack trace **bottom-up**. Root cause is at the bottom.
2. Identify the **minimal reproduction**: smallest input that triggers the bug.
3. State a hypothesis: *"X fails because Y"*. Never edit without one.

### Phase 2 — Locate
1. Trace data flow: where is data created? Where does it first diverge from expected?
2. Use targeted searches before reading entire files.
3. **Check recent changes first** — bugs live near the last edit.

### Phase 3 — Diagnose

| Category | Questions |
|---|---|
| **Type/Shape** | Is data the type/shape the function expects? |
| **Null/Undefined** | Can any value be null/undefined unexpectedly? |
| **Async** | Is a promise awaited that shouldn't be, or vice versa? |
| **Scope/Closure** | Is a variable closing over the right context? |
| **Mutation** | Is state mutated where it should be immutable? |
| **Off-by-one** | Is array indexing or loop boundary correct? |
| **Encoding** | Is there a charset mismatch in input/output? |
| **Environment** | Does the bug only appear in specific env/config? |

### Phase 4 — Fix (surgical, not cosmetic)
- Fix **only** the identified root cause. Zero refactoring of surrounding code.
- Minimum change to restore the violated invariant.

### Phase 5 — Validate
- Confirm original error is gone.
- Check for regressions in callers that depended on the old behavior.

---

## Anti-patterns (never do these)
- Adding `null` guards everywhere instead of finding why null is produced.
- Copying a Stack Overflow fix without understanding it.
- Assuming the test is correct when the test itself may be the bug.
- Blaming the framework before reading your own code.

---

## Output Format
1. **Root cause** — 1 sentence
2. **Fix** — minimal code change
3. **Why this works** — 1 sentence on the invariant restored
