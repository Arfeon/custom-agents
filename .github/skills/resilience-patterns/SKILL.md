# Skill: Resilience Patterns

## Invocation
```
readFile: skills/resilience-patterns/SKILL.md
```
Load before implementing any retry logic, timeout handling, fallback behavior, or fault-tolerance mechanism in a distributed system.

---

## Trigger Conditions
- User calls external APIs, databases, or message queues
- User asks about handling failures, timeouts, or degraded dependencies
- User needs to protect a service from cascading failures
- User designs a system that must maintain availability under partial failures

---

## Core Patterns

### 1. Timeout

Every external call MUST have a timeout. "Eventually" is not a response time.

```python
# Bad — hangs indefinitely
response = requests.get("https://api.example.com/data")

# Good
response = requests.get("https://api.example.com/data", timeout=5.0)
```

**Timeout hierarchy** (set at every layer):
| Layer | Recommended timeout |
|---|---|
| HTTP client | 5–30s depending on operation |
| DB query | 3–10s |
| Message queue consumer | Based on expected processing time × 2 |
| Service-to-service call | < downstream SLO |

---

### 2. Retry with Exponential Backoff + Jitter

**Only retry on transient failures** (network, 429, 503). Never retry on 400, 401, 404.

```
wait = min(cap, base * 2^attempt) + random_jitter(0, 300ms)
```

| Parameter | Recommended value |
|---|---|
| Base delay | 100ms |
| Max delay (cap) | 30s |
| Max attempts | 3–5 |
| Jitter | 0–300ms (prevents thundering herd) |

**Retryable status codes**: 429, 500, 502, 503, 504, network timeouts.
**Non-retryable**: 400, 401, 403, 404, 409, 422.

---

### 3. Circuit Breaker

Prevents a failing dependency from taking down the entire service.

```
States: CLOSED → OPEN → HALF-OPEN → CLOSED

CLOSED:     Requests flow normally. Track failure rate.
OPEN:       Requests fail-fast (no network call). After timeout → HALF-OPEN.
HALF-OPEN:  Allow one probe request. Success → CLOSED. Failure → OPEN.
```

**Configuration guidelines**:
| Parameter | Value |
|---|---|
| Failure threshold | 50% error rate over 10s window |
| Min request volume | 20 requests (don't trip on 1 failure) |
| Open state duration | 30–60s |
| Half-open probe limit | 1–3 requests |

**Libraries**: Resilience4j (Java), Polly (.NET), `circuitbreaker` (Python), Hystrix (deprecated).

---

### 4. Bulkhead

Isolate resource pools so one failing consumer can't exhaust all resources.

```
Without bulkhead:       [Service A] ──┬──→ [Thread Pool: 100]
                        [Service B] ──┘         ↑ one service exhausts all

With bulkhead:          [Service A] ──→ [Thread Pool: 50]
                        [Service B] ──→ [Thread Pool: 50]
```

Apply to:
- Thread pools / async executors per downstream service
- DB connection pools (separate pools for read/write if needed)
- Rate limiter quotas per client/tenant

---

### 5. Rate Limiter

Protect your service from overload (inbound) and protect your dependencies (outbound).

**Algorithms**:
| Algorithm | Best for |
|---|---|
| **Token Bucket** | Bursty traffic with sustained average rate |
| **Sliding Window** | Smooth rate limiting without burst allowance |
| **Fixed Window** | Simple cases, acceptable boundary burst |

**Redis-based rate limiting** is preferred for distributed systems (shared state across instances).

---

### 6. Fallback & Graceful Degradation

When a dependency fails, define what the system should do instead:

| Strategy | Use when |
|---|---|
| **Return cached value** | Stale data is acceptable |
| **Return default/empty** | Feature is non-critical |
| **Serve static response** | UI/read-only degraded mode |
| **Queue for later** | Write operation, eventual consistency acceptable |
| **Fail fast with 503** | Operation is critical, degradation not safe |

**Never silently ignore failures.** If you fall back, log it as WARN with the original error.

---

## Resilience Checklist (per external dependency)

- [ ] Timeout configured
- [ ] Retry with exponential backoff + jitter (transient errors only)
- [ ] Circuit breaker configured and tested
- [ ] Bulkhead isolates this dependency's resource pool
- [ ] Fallback behavior defined and implemented
- [ ] All failures logged with context (service, operation, attempt count)
- [ ] SLO impact of this dependency documented
