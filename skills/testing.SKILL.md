# Skill: Testing

## Invocation
```
readFile: skills/testing.SKILL.md
```
Load when the user asks to write tests, or when Guardian identifies untested areas in reviewed code.

---

## Trigger Conditions
- User asks "how do I test this", "write tests for X", or "what should I test"
- Guardian flags an area as lacking test coverage
- User adds a new function, class, or API endpoint
- User asks about mocking, test doubles, or test setup

---

## Test Types and Scope

| Type | Scope | Speed | Use for |
|---|---|---|---|
| **Unit** | Single function/class | Milliseconds | Business logic, domain rules, pure functions |
| **Integration** | Multiple components together | Seconds | Repository + DB, service + external API |
| **Contract** | API boundary between services | Seconds | Verifying consumer/provider agreements |
| **E2E** | Full user flow | Minutes | Critical user paths only |

**Rule**: 80% unit, 15% integration, 5% E2E. Invert this pyramid and your suite is slow and fragile.

---

## Test Structure: AAA Pattern

Every test MUST follow **Arrange → Act → Assert**. No exceptions.

```python
def test_order_total_applies_discount_when_above_threshold():
    # Arrange
    order = Order(items=[Item(price=60), Item(price=60)])
    discount_policy = PercentageDiscount(rate=0.10, threshold=100)

    # Act
    total = order.calculate_total(discount_policy)

    # Assert
    assert total == 108.0  # 120 - 10%
```

**Rules**:
- One logical concept per test — one reason to fail.
- Test name describes the scenario: `test_<subject>_<condition>_<expected_result>`.
- No logic in tests (no if/for). If you need logic, you need more tests.

---

## What to Test

### ✅ Always test:
- **Business rules and invariants** — the core logic of your domain
- **Edge cases**: empty inputs, zero, max values, boundaries
- **Error paths**: what happens when something fails (not just the happy path)
- **Public interfaces** — test through the public API, not internal implementation

### ❌ Never test:
- Framework/library internals (Express routing, Django ORM, SQLAlchemy)
- Trivial getters/setters with no logic
- Language features (e.g., testing that `+` adds numbers)
- Implementation details (private methods directly)

---

## Mocking & Test Doubles

| Double Type | Use for | When to use |
|---|---|---|
| **Stub** | Returns fixed values | Replacing a dependency that returns data |
| **Mock** | Verifies interactions | Checking a method was called with the right args |
| **Spy** | Wraps real implementation, records calls | Testing side effects without full isolation |
| **Fake** | Lightweight working implementation | InMemoryRepository for test isolation |

**Rules**:
- Mock at the boundary of your system (repositories, HTTP clients, file system).
- Never mock the same class you're testing.
- Prefer Fakes over Mocks — Fakes are less brittle.

```python
# Preferred: use a fake repository
class InMemoryUserRepository:
    def __init__(self): self._store = {}
    def save(self, user): self._store[user.id] = user
    def find_by_id(self, id): return self._store.get(id)

# Less preferred: mock everything
mock_repo = Mock()
mock_repo.find_by_id.return_value = User(id="1", name="Alice")
```

---

## Edge Cases Checklist

For every function/method, consider testing:

| Category | Cases |
|---|---|
| **Nulls / Empty** | `None`, `""`, `[]`, `{}`, `0` |
| **Boundaries** | min-1, min, max, max+1 |
| **Wrong type** | String where int expected, etc. |
| **Duplicates** | Same item twice in a list/set |
| **Concurrency** | Shared state modified concurrently (if applicable) |
| **Auth/Permissions** | Unauthenticated, wrong role, expired token (for HTTP) |
| **External failure** | Dependency returns 500, timeout, empty response |

---

## Test File Conventions

```
src/
  domain/
    order.py
  tests/
    unit/
      test_order.py         ← mirrors src structure
    integration/
      test_order_repository.py
```

- Test files mirror the source structure under `tests/`.
- Test file name: `test_<source_file_name>`.
- Group related tests in a class or describe block.
- Shared setup in `setUp` / `beforeEach` / fixtures — never in individual tests.

---

## Test Quality Checklist

Before submitting tests:
- [ ] Tests pass in isolation (no shared mutable state between tests)
- [ ] Tests are deterministic (same result every run, no time/random dependencies)
- [ ] No external dependencies (DB, network, filesystem) in unit tests
- [ ] Test names describe the scenario and expected outcome
- [ ] Happy path AND error paths are covered
- [ ] Edge cases from the checklist are addressed
