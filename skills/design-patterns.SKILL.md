# Skill: Design Patterns

## Invocation
```
readFile: skills/design-patterns.SKILL.md
```
Load when designing or reviewing code where complexity, variability, or extensibility is a concern.

---

## Trigger Conditions
- User creates a class or module with multiple responsibilities
- User has long if/else or switch chains based on type
- User needs to decouple components
- User asks "how to structure this" or "is there a better way"
- Code is hard to extend without modifying existing classes

---

## Selection Principles

Before choosing a pattern:
1. **Understand the problem** — name the design pressure. Is it variability? Coupling? Complexity?
2. **Start simple** — a function or a class without a pattern is often the right answer for small problems.
3. **Apply the minimum** — a pattern adds indirection; add it only when the trade-off is justified.
4. **Match the context** — the right pattern depends on whether variance is at runtime, at compile time, or expected future variance.

---

## Creational Patterns

### Factory Method
**Problem**: Object creation logic is complex, repeated, or must vary by context.
**When to use**: Different implementations of an interface need to be created, but the caller shouldn't know which.
**When NOT to use**: You only ever create one type — it's unnecessary abstraction.
```
Interface ProductFactory {
  createProduct(): Product
}
ConcreteFactoryA → creates ProductA
ConcreteFactoryB → creates ProductB
```

### Abstract Factory
**Problem**: Families of related objects must be created together and stay consistent.
**When to use**: UI themes (buttons + modals + inputs all from same theme family).
**When NOT to use**: Only one product type — use Factory Method instead.

### Builder
**Problem**: Object construction has many optional/required parameters, leading to telescoping constructors.
**When to use**: Object with ≥ 4 parameters, or when construction steps vary.
**Rule**: expose only the final `build()` method. Never expose an incomplete object.
```
OrderBuilder
  .withProduct(product)
  .withQuantity(2)
  .withShipping("express")
  .build()
```

### Singleton
**Problem**: Exactly one instance of a resource is needed globally.
**When to use**: Logger, config, connection pool. **Sparingly.**
**Anti-pattern risk**: Global mutable state → hard to test, hidden coupling. Prefer dependency injection over global Singleton.

---

## Structural Patterns

### Adapter
**Problem**: Two incompatible interfaces need to work together.
**When to use**: Integrating a third-party library or legacy code without modifying it.
```
LegacyPaymentGateway → PaymentAdapter (implements PaymentPort) → domain code
```

### Decorator
**Problem**: Add behavior to an object at runtime without subclassing.
**When to use**: Cross-cutting concerns: logging, caching, validation, retry — layered on top of a base implementation.
**Key rule**: Decorator implements the same interface as the component it wraps.
```
BaseRepository → CachedRepository(BaseRepository) → LoggedRepository(CachedRepository)
```

### Facade
**Problem**: A subsystem is complex; callers don't need to know its internals.
**When to use**: Simplify a complex subsystem for external consumers. API controllers are often facades.
**Rule**: Facade should not add logic — only coordination and delegation.

### Repository
**Problem**: Business logic is tangled with data access code.
**When to use**: Every data access goes through a repository interface. Domain code never knows about SQL/ORM.
```
UserRepository (interface)
  → SqlUserRepository (implementation)
  → InMemoryUserRepository (test double)
```
**Rule**: Repositories return domain objects, never raw DB rows or ORM entities.

### Proxy
**Problem**: Control access to an object (lazy loading, security, caching).
**When to use**: Remote proxy (RPC stub), virtual proxy (lazy init), protection proxy (auth check before delegation).

---

## Behavioral Patterns

### Strategy
**Problem**: An algorithm varies and needs to be swappable at runtime.
**When to use**: Multiple implementations of the same operation that should be interchangeable.
```
PaymentProcessor
  → StripeStrategy
  → PayPalStrategy
  → BankTransferStrategy
Injected at runtime based on configuration/user choice.
```
**Rule**: All strategies implement the same interface. The context doesn't know which one it's using.

### Observer / Event
**Problem**: One object changes state and multiple others need to react, without tight coupling.
**When to use**: Domain events, UI state propagation, pub/sub within a single process.
**When NOT to use**: Cross-service async communication (use a message broker + event-driven design instead).

### Command
**Problem**: Encapsulate an operation as an object to enable queuing, undo/redo, or transactional operations.
**When to use**: Undo/redo systems, task queues, audit logs of operations.
```
Command interface: execute() / undo()
PlaceOrderCommand, CancelOrderCommand — stored in history stack.
```

### Template Method
**Problem**: An algorithm's skeleton is fixed, but some steps vary.
**When to use**: Base class defines the flow; subclasses override specific steps without changing the flow.
**vs Strategy**: Template Method uses inheritance; Strategy uses composition. Prefer Strategy for runtime flexibility.

### Chain of Responsibility
**Problem**: A request must pass through multiple handlers, each deciding to process or pass it on.
**When to use**: Middleware pipelines, validation chains, authorization checks.
```
Request → AuthMiddleware → RateLimitMiddleware → ValidationMiddleware → Handler
```

---

## Anti-patterns (common traps)

| Anti-pattern | What it looks like | Fix |
|---|---|---|
| **God Object** | One class that does everything | Split by SRP |
| **Anemic Domain Model** | Entities with no behavior, only data | Move logic into the domain |
| **Service Locator** | Calling a global registry for dependencies | Use constructor injection |
| **Primitive Obsession** | Passing raw strings/ints where types should be used | Create Value Objects |
| **Magic Numbers** | `if (status == 3)` | Named constants or enums |
