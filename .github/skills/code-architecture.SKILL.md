# Skill: Code Architecture Systems

## Invocation
```
readFile: skills/code-architecture.SKILL.md
```
Load when structuring a new project, reviewing an existing codebase's architecture, or deciding how to organize modules, layers, and dependencies.

---

## Trigger Conditions
- User starts a new service or module from scratch
- User asks "how should I structure this project"
- User is mixing business logic with infrastructure/framework code
- Code is hard to test because it's coupled to the database, HTTP, or external services
- User asks about layers, hexagonal, clean architecture, DDD
- User asks where a specific piece of logic "belongs"

---

## Step 1 — Read the workspace first

Before recommending an architecture, use `search/codebase` or `search/fileSearch` to detect what pattern is already in use.

**Detection signals**:
| Signal | Pattern |
|---|---|
| `domain/`, `application/`, `infrastructure/` folders | Clean / Onion Architecture |
| `ports/`, `adapters/`, `core/` folders | Hexagonal Architecture |
| `models/`, `views/`, `controllers/` folders | MVC |
| `aggregates/`, `repositories/`, `value-objects/` folders | DDD |
| Flat structure, no layers | None / ad-hoc |

**Rule**: don't change the existing architecture pattern. Evolve within it.

---

## Architecture Patterns

### Layered Architecture (N-Tier)

```
┌─────────────────────────────┐
│  Presentation Layer         │  HTTP handlers, CLI, UI controllers
├─────────────────────────────┤
│  Application Layer          │  Use cases, application services, DTOs
├─────────────────────────────┤
│  Domain Layer               │  Business entities, business rules, domain services
├─────────────────────────────┤
│  Infrastructure Layer       │  DB, file system, external APIs, message brokers
└─────────────────────────────┘
```

**Dependency rule**: dependencies flow **downward only**. Inner layers know nothing about outer layers.
**When to use**: Standard CRUD applications, REST APIs, most business apps.

---

### Clean Architecture (Uncle Bob)

```
         ┌─────────────────────────┐
         │   Frameworks & Drivers  │ ← outermost: Express, FastAPI, Prisma, etc.
         │  ┌───────────────────┐  │
         │  │  Interface Adapts │  │ ← Controllers, Presenters, Gateways
         │  │  ┌─────────────┐  │  │
         │  │  │  Use Cases  │  │  │ ← Application business rules
         │  │  │  ┌───────┐  │  │  │
         │  │  │  │Entities│  │  │  │ ← Enterprise business rules
         │  │  │  └───────┘  │  │  │
         │  │  └─────────────┘  │  │
         │  └───────────────────┘  │
         └─────────────────────────┘
```

**The Dependency Rule**: source code dependencies can only point **inward**. Nothing in an inner circle knows anything about outer circles.

**Key principle**: the domain and use case layers must not import any framework, ORM, or HTTP library.

```
✅ Use case calls:  UserRepository (interface in domain)
✅ Infra provides:  SqlUserRepository (impl in infrastructure)
❌ Never:           Use case imports prisma, SQLAlchemy, or express directly
```

---

### Hexagonal Architecture (Ports & Adapters)

```
        External World
             │
    ┌────────▼────────┐
    │    Adapters     │  HTTP adapter, CLI adapter, test adapter, message adapter
    │  ┌───────────┐  │
    │  │   Ports   │  │  Interfaces defined by the domain
    │  │  ┌─────┐  │  │
    │  │  │CORE │  │  │  Pure business logic, no dependencies
    │  │  └─────┘  │  │
    │  └───────────┘  │
    └─────────────────┘
        External World
    (DB, APIs, brokers)
```

**Ports**: interfaces owned by the application core. Define what the outside world must provide.
**Adapters**: implementations of ports. They live in the infrastructure layer.

```// Port (defined in domain)
interface UserRepository {
  findById(id: UserId): Promise<User | null>
}

// Adapter (implements the port, lives in infra)
class PostgresUserRepository implements UserRepository { ... }
class InMemoryUserRepository implements UserRepository { ... }  // for tests
```

**Primary ports**: drive the application (HTTP controller calls a use case).
**Secondary ports**: driven by the application (use case calls a repository port).

---

### Domain-Driven Design (DDD) Building Blocks

Use these concepts when business logic is complex and the domain model is the core of the system.

| Building Block | Definition | Rule |
|---|---|---|
| **Entity** | Object with a unique identity that persists over time | Equality by ID |
| **Value Object** | Immutable object defined by its attributes | Equality by value. No setters. |
| **Aggregate** | Cluster of entities + value objects with a single root | Only the root is accessible from outside |
| **Aggregate Root** | The entity that guards the aggregate's invariants | All mutations go through it |
| **Domain Service** | Business logic that doesn't belong to a single entity | Stateless, operates on multiple entities |
| **Repository** | Abstraction for persisting/loading aggregates | One repo per aggregate root |
| **Domain Event** | Something that happened in the domain that other parts care about | Past tense, immutable |
| **Bounded Context** | Explicit boundary where a domain model is defined and consistent | Don't share models across contexts |

**Aggregate rules**:
1. Load → mutate → save as one atomic unit.
2. Only one aggregate root per transaction.
3. Reference other aggregates by ID, never by object reference.

---

## Placement Rules (where does this code go?)

Use this table to decide where a piece of logic belongs:

| "Where does X go?" | Layer/Component |
|---|---|
| HTTP request parsing, response formatting | Presentation / Adapter |
| Orchestrating multiple domain operations | Application / Use Case |
| Business invariants, domain rules | Domain / Entity / Domain Service |
| Validation of domain state | Domain Entity constructor or Value Object |
| Input validation (format, required fields) | Presentation / DTOs |
| DB queries, external API calls | Infrastructure / Adapter |
| Data transformation between layers | DTO / Mapper (Application layer) |

**The test**:
> "If I remove the framework (Express, Django, Spring...) and the database, can this code still be used?"
> - YES → it belongs in Domain or Application layer.
> - NO → it belongs in Infrastructure or Presentation layer.

---

## Anti-patterns

| Anti-pattern | Symptom | Fix |
|---|---|---|
| **Anemic Domain Model** | Entities are just data bags; all logic is in services | Move behavior into entities/aggregates |
| **Fat Controller** | Controllers contain business logic | Extract to use cases/application services |
| **Infrastructure Leakage** | Prisma/SQLAlchemy types in domain layer | Use domain types + repository interfaces |
| **Shared DB across services** | Two microservices read/write the same table | Each service owns its data source |
| **God Service** | One service class with 20+ methods | Split by use case; one class = one responsibility |
