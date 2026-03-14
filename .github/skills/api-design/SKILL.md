# Skill: REST API Design

## Invocation
```
readFile: skills/api-design/SKILL.md
```
Load this skill when the user designs, creates, or reviews REST endpoints, controllers, or HTTP handlers.

---

## Trigger Conditions
- User asks to create a new endpoint or route
- User asks to review an existing API
- User asks about HTTP methods, status codes, or response format
- User designs a new service with a public interface
- **You are about to implement or review any HTTP endpoint or handler**

---

## Core Principles

### 1. Resource-Oriented URLs
- URLs = nouns (resources), not verbs (actions).
- Plural: `/users`, `/orders/{id}`, `/products`.
- Max one level of nesting: `/users/{id}/orders` ✅ | `/users/{id}/orders/{id}/items` ❌

### 2. HTTP Method Semantics

| Method | Use | Idempotent? | Body? |
|---|---|---|---|
| `GET` | Read | ✅ | ❌ |
| `POST` | Create | ❌ | ✅ |
| `PUT` | Full replace | ✅ | ✅ |
| `PATCH` | Partial update | ❌ | ✅ |
| `DELETE` | Remove | ✅ | ❌ |

### 3. HTTP Status Codes

| Code | Use for |
|---|---|
| `200` | Generic success |
| `201` | Resource created (POST/PUT) |
| `204` | Success, no body (DELETE) |
| `400` | Malformed request |
| `401` | Not authenticated |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | State conflict / duplicate |
| `422` | Validation errors |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error (never expose stack trace) |

### 4. Response Envelope
Pick one format, use it everywhere:
```json
{ "data": { ... }, "error": null }
{ "data": null, "error": { "code": "VALIDATION_FAILED", "message": "email is required" } }
```

- `camelCase` for JS clients, `snake_case` for Python clients — **never mix**.
- Never expose internal IDs, stack traces, or ORM error messages.

### 5. Versioning
`/api/v1/resource` — URL prefix. Simple, cache-friendly. Default choice.

### 6. Pagination (always enforce on list endpoints)
```json
{
  "data": [...],
  "pagination": { "total": 150, "page": 2, "pageSize": 20, "nextCursor": "abc" }
}
```
Cursor-based for real-time/large datasets. Offset for simple cases.

### 7. Security Checklist
- [ ] Every non-public endpoint requires authentication
- [ ] Authorization checked per-resource, not just per-route
- [ ] Rate limiting on auth and public endpoints
- [ ] Input validated and sanitized before processing
- [ ] List endpoints paginated (never unbounded)
- [ ] No sensitive data in URLs (tokens, passwords)

---

## Output Format
1. **Endpoint table** — method, path, description, auth required
2. **Request/response examples** per endpoint
3. **Issues found** (if reviewing) — by severity
