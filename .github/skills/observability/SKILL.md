# Skill: Observability — Logging, Metrics & Distributed Tracing

## Invocation
```
readFile: skills/observability/SKILL.md
```
Load before implementing any logging, monitoring, alerting, or tracing in a service.

---

## Trigger Conditions
- User adds logging to a component
- User asks about monitoring, alerting, or dashboards
- User needs to trace a request across multiple services
- User asks about structured logs, log levels, or log aggregation
- User debugs a production issue with no visibility into what happened
- **You are about to add logging, metrics, or tracing to any code**

---

## The Three Pillars

### 1. Structured Logging

**Rules**:
- **Always use structured logs** (JSON). Never raw strings in production.
- **Never log sensitive data**: passwords, tokens, PII, credit card numbers.
- **Log at the right level**:

| Level | Use for |
|---|---|
| `DEBUG` | Development/trace detail. Off in production by default. |
| `INFO` | Normal operational events (service started, request received) |
| `WARN` | Recoverable anomalies (retry attempted, fallback triggered) |
| `ERROR` | Failures that need attention but don't stop the service |
| `FATAL` | Unrecoverable failures causing service shutdown |

**Minimum required fields per log entry**:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "ERROR",
  "service": "payment-service",
  "traceId": "abc-123",
  "spanId": "def-456",
  "message": "Payment charge failed",
  "error": { "type": "CardDeclinedException", "message": "Insufficient funds" },
  "userId": "REDACTED",
  "orderId": "ord-789"
}
```

**Correlation rule**: every log entry in a request chain MUST share the same `traceId`. Propagate it across service boundaries.

---

### 2. Metrics

**Types and when to use**:

| Type | Use for | Example |
|---|---|---|
| **Counter** | Monotonically increasing events | `http_requests_total`, `errors_total` |
| **Gauge** | Point-in-time snapshots | `active_connections`, `queue_depth` |
| **Histogram** | Distribution of values | `request_duration_seconds`, `payload_size_bytes` |
| **Summary** | Pre-computed quantiles | `response_time_p99` |

**Mandatory metrics for any service**:
- `http_request_duration_seconds` (histogram, by method/route/status)
- `http_requests_total` (counter, by method/route/status)
- `error_rate` (counter, by error type)
- `active_connections` or `queue_depth` (gauge)

**Naming convention** (Prometheus format):
```
<namespace>_<subsystem>_<name>_<unit>
# Example: payment_processor_charge_duration_seconds
```

---

### 3. Distributed Tracing (OpenTelemetry)

**Concepts**:
- **Trace**: end-to-end record of a single request across all services.
- **Span**: a single unit of work within a trace (one service call, one DB query).
- **Context propagation**: pass `traceId` + `spanId` in HTTP headers (`traceparent` W3C standard).

**Implementation checklist**:
- [ ] Initialize OpenTelemetry SDK at service startup
- [ ] Auto-instrument HTTP clients and servers
- [ ] Instrument DB calls and external API calls
- [ ] Propagate context via `traceparent` header across all HTTP calls
- [ ] Export to a backend (Jaeger, Zipkin, Grafana Tempo, OTLP)

**Span attribute naming** (semantic conventions):
```
http.method, http.url, http.status_code
db.system, db.statement, db.operation
messaging.system, messaging.destination
```

---

## SLI / SLO / SLA Definitions

| Term | Definition | Example |
|---|---|---|
| **SLI** | Measurable indicator of service behavior | 99th percentile latency |
| **SLO** | Target value for an SLI | p99 latency < 200ms |
| **SLA** | Business contract built on SLOs | 99.9% uptime per month |
| **Error Budget** | Allowed downtime before SLO is breached | 43.8 min/month for 99.9% |

**Standard SLIs to define for every service**:
- Availability: `successful_requests / total_requests`
- Latency: p50, p95, p99
- Error rate: `error_requests / total_requests`
- Throughput: `requests_per_second`

---

## Anti-patterns
- Logging `user.password`, `token`, or full request bodies at INFO/DEBUG without redaction.
- Using `console.log` / `print` in production code — use a structured logger.
- Catching and swallowing exceptions without logging them.
- Creating metrics with unbounded cardinality (e.g., userId as a label).
- Logging the same event 5 different ways across 5 files — centralize.
