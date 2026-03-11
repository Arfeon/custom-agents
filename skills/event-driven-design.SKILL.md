# Skill: Event-Driven Design

## Invocation
```
readFile: skills/event-driven-design.SKILL.md
```
Load when the user designs or implements asynchronous messaging, event sourcing, CQRS, or any system where components communicate via events/messages.

---

## Trigger Conditions
- User uses Kafka, RabbitMQ, SQS, EventBridge, NATS, or any message broker
- User asks about decoupling services or async communication
- User designs an event-sourced system or aggregate
- User asks about CQRS (Command Query Responsibility Segregation)
- User implements a saga or distributed transaction

---

## Core Concepts

### Event vs Command vs Query

| Type | Direction | Example | Expectation |
|---|---|---|---|
| **Command** | One sender → one receiver | `PlaceOrder` | Will be executed (or rejected) |
| **Event** | One sender → many consumers | `OrderPlaced` | Already happened, consumers react |
| **Query** | One sender → one receiver | `GetOrderById` | Returns data, has no side effects |

**Rule**: Commands are imperative (do this). Events are past tense (this happened). Never name events as commands.

---

## Event Schema Design

### Envelope Pattern (mandatory for all events)
```json
{
  "id": "uuid-v4",
  "type": "order.placed",
  "version": "1.0",
  "source": "order-service",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "correlationId": "trace-abc-123",
  "causationId": "cmd-uuid-that-caused-this",
  "data": { ... }
}
```

**Versioning rules**:
- Additive changes (new optional fields): MINOR bump → backward compatible.
- Removing or renaming fields: MAJOR bump → create new event type, deprecate old.
- Never change field semantics without a version bump.

### Event Naming Convention
```
<domain>.<aggregate>.<past-tense-verb>

Examples:
  payment.transaction.completed
  inventory.product.stock-updated
  user.account.password-changed
```

---

## Patterns

### Event Sourcing

Store state as an immutable, append-only sequence of events. Derive current state by replaying.

```
When to use:
  ✅ Full audit trail is required (finance, healthcare, compliance)
  ✅ Time-travel / point-in-time state reconstruction needed
  ✅ Event-driven projections to multiple read models

When NOT to use:
  ❌ Simple CRUD without audit requirements (over-engineering)
  ❌ Team unfamiliar with eventual consistency trade-offs
```

**Aggregate rules**:
1. Aggregates are consistency boundaries — load, mutate, save as one unit.
2. One aggregate root per transaction.
3. Events emitted by an aggregate MUST be handled within the same transaction (outbox pattern).

---

### CQRS (Command Query Responsibility Segregation)

Separate the write model (commands) from the read model (queries).

```
Write side:  Command → Validate → Apply to Aggregate → Emit Event → Store
Read side:   Event → Update Projection (denormalized read model)

Benefits:
  - Read model optimized for query patterns (no joins)
  - Write model optimized for consistency
  - Scale reads and writes independently
```

**When to apply**:
- High read/write asymmetry
- Complex domain with multiple read representations
- Event sourcing (natural fit)

---

### Outbox Pattern (guaranteed event delivery)

Prevent the dual-write problem: DB write + event publish in the same atomic operation.

```
1. Write domain event to an `outbox` table in the SAME DB transaction as the state change.
2. A separate relay process polls the outbox and publishes to the message broker.
3. On successful publish, mark outbox entry as processed.
```

**Never publish events directly in application code outside a transaction.** If the DB write succeeds and the broker publish fails, you have lost events.

---

### Saga Pattern (distributed transactions)

Coordinate a multi-service transaction without a 2PC distributed lock.

| Type | How | Use when |
|---|---|---|
| **Choreography** | Each service reacts to events and emits next event | < 4 services, simple flows |
| **Orchestration** | A coordinator sends commands to each service | Complex flows, explicit compensation logic |

**Compensation rules**:
- Every step must have a compensating action (rollback).
- Compensating actions must be idempotent.
- Sagas reach eventual consistency — never strong consistency.

---

## Consumer Rules

### Idempotency (mandatory)
Every event consumer MUST be idempotent — processing the same event twice must produce the same result.

```
Implementation:
  - Track processed event IDs in a dedup store (Redis, DB table)
  - Check: if event.id already in processed → skip and ack
  - Window: keep dedup store for at least (max broker retry window × 2)
```

### At-least-once delivery handling
Message brokers guarantee at-least-once delivery, not exactly-once. Design for duplicates.

### Dead Letter Queue (DLQ)
Every consumer must configure a DLQ. After N failed retries:
1. Move message to DLQ.
2. Alert on DLQ depth > 0.
3. Never silently discard failed messages.

---

## Broker-Specific Notes

| Broker | Partition/Ordering | Retention | Replay |
|---|---|---|---|
| **Kafka** | Ordered per partition-key | Configurable (days/forever) | ✅ Replay from offset |
| **RabbitMQ** | No ordering guarantee | Until consumed | ❌ No native replay |
| **AWS SQS** | FIFO queue optional | 14 days max | ❌ No replay |
| **NATS JetStream** | Ordered per subject | Configurable | ✅ Replay from sequence |

Use **Kafka** when event replay and long retention are required (event sourcing, audit logs).
