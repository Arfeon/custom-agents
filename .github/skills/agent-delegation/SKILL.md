# Skill: Agent Delegation Playbook

## Invocation
```
readFile: skills/agent-delegation/SKILL.md
```
Load this skill before deciding whether to delegate to a subagent. It defines when, how, and what to pass to each specialized agent.

---

## Trigger Conditions
- You are unsure which agent to invoke for the user's request
- The task involves multiple domains (design + security, or ML + cloud, etc.)
- **You are about to invoke any subagent** — always load this first to confirm the right choice
- User asks which agent handles a specific type of task

**Delegate early, not late.** If a request requires specialized expertise, invoke the right agent upfront — don't attempt it yourself and call the agent only after failing.

**Parallelize when independent.** If Architect and Guardian reviews are both needed, invoke them in parallel. Only serialize if one's output is input to the other.

---

## Decision Tree

```
User request received
        │
        ▼
Is there a design/architecture/pattern decision?
  YES → invoke Architect
        │
        ▼
Does the code handle external input, secrets, auth, or sensitive data?
  YES → invoke Guardian
        │
        ▼
Does the request involve deployment, CI/CD, containers, or IaC?
  YES → invoke DevOps
        │
        ▼
Is the request about ML frameworks (TensorFlow/Keras/PyTorch) or Google/Vertex AI compatibility?
  YES → invoke GCP ML Expert
        │
        ▼
Can you answer the remaining part confidently?
  YES → answer directly (possibly loading a skill)
  NO  → load the relevant skill, then answer
```

---

## When to Invoke Each Agent

### `Architect`
**Invoke when**:
- User asks to design a new module, service, or class
- Existing code has smells: God class, fat controller, mixed responsibilities
- A design pattern selection is needed
- Code needs refactoring for SOLID compliance
- User asks "how should I structure X"

**Do NOT invoke for**:
- Simple bug fixes with no structural impact
- One-line changes or trivial additions
- Questions about library APIs (use Context7 skill instead)

**What to pass**:
```
- The relevant code (file paths or snippets)
- The user's intent (what they're trying to achieve)
- The existing architecture pattern detected in the workspace
- Any constraints (language, framework, performance requirements)
```

---

### `Guardian`
**Invoke when**:
- New endpoint or API route is being added
- Code handles user input (forms, query params, file uploads)
- Code stores or transmits sensitive data (passwords, tokens, PII)
- Authentication or authorization logic is implemented
- Dependency updates or new libraries are introduced
- Any external integration (third-party APIs, webhooks)

**Do NOT invoke for**:
- Pure internal utility functions with no external input
- Read-only exploratory queries
- Documentation or comment-only changes

**What to pass**:
```
- The code to audit (file paths or snippets)
- The data flow: what enters, what is stored, what is returned
- The threat model context (is this public-facing? internal only?)
- Any known security requirements or compliance context
```

---

### `DevOps`
**Invoke when**:
- User needs a CI/CD pipeline or Dockerfile
- Deployment strategy needs to be defined or changed
- Infrastructure as Code (Terraform, Pulumi, CDK) is involved
- Environment configuration or secret injection is needed
- Container orchestration (Kubernetes, ECS) is in scope
- Performance/scalability at infrastructure level is the concern

**Do NOT invoke for**:
- Application-level performance (code profiling) → handle yourself
- Library or framework questions → use Context7 skill
- Architecture of the application code → use Architect

**What to pass**:
```
- The target environment (cloud provider, container platform)
- The current pipeline/infra state if it exists
- Deployment requirements (zero-downtime? rollback speed? canary?)
- Any compliance or security constraints (SOC2, HIPAA, etc.)
```

---

### `GCP ML Expert`
**Invoke when**:
- User requests TensorFlow/Keras/PyTorch implementation or troubleshooting
- User asks to migrate ML workflows to Google Cloud or Vertex AI
- User asks to make existing ML code "work on Google"
- User needs adapter classes or cloud-compatible training/serving flows

**Do NOT invoke for**:
- Generic cloud infrastructure without ML context (use DevOps)
- Non-ML library API questions (use Context7 skill)

**What to pass**:
```
- Current ML framework and version constraints
- Existing training/serving code paths and execution mode
- Target Google flow (training, tuning, deployment, prediction)
- Security constraints: IAM, service accounts, secrets, data locations
```

---

## Chaining Agents

Some tasks require multiple agents in sequence:

### Pattern 1: Design → Security (most common)
```
1. Architect reviews and proposes design
2. Guardian audits the proposed design for security issues
3. Synthesize both outputs before responding to user
```

### Pattern 2: Design → Implementation → Security
```
1. Architect proposes structure
2. You implement based on Architect's output
3. Guardian audits the implementation
```

### Pattern 3: Full pipeline
```
1. Architect: code structure and patterns
2. Guardian: security and edge cases
3. DevOps: deployment and infrastructure
```
Apply only when the user's request spans all three domains.

---

## How to Synthesize Agent Outputs

After receiving responses from subagents:
1. **Resolve conflicts explicitly** — if Architect and Guardian recommend opposing things, explain the trade-off to the user.
2. **Present a unified recommendation** — don't dump raw agent output. Integrate it.
3. **Prioritize security over elegance** — if Guardian flags a CRITICAL issue in what Architect designed, the security concern wins.
4. **Be clear about what came from which agent** in your summary when the distinction helps the user understand the reasoning.

---

## Anti-patterns (delegation mistakes)

| Mistake | Problem | Correction |
|---|---|---|
| Invoking all agents for every task | Slow, noisy, over-engineered | Use the decision tree to invoke only what's needed |
| Invoking Architect after you already implemented | Wasted work, resistance to change | Invoke before implementing |
| Passing full codebase to each agent | Context overload, irrelevant noise | Pass only the relevant files/snippets |
| Ignoring Guardian on public endpoints | Security gaps shipped to production | Guardian is mandatory for all external interfaces |
| Sequential agents when parallel is possible | Slow | Architect + Guardian can run in parallel when both are needed |
