# Session Management, OOP & Design Patterns (H + I + L)

> Active when the diff contains `pages/**`, `tests/**`, `fixtures/**`, or `test-flows/**`.

---

### H. OOP / SOLID PRINCIPLES

**Single Responsibility:**
- [ ] Each class has exactly one job: Page = actions, Asserter = assertions, Steps = orchestration, Flow = business journeys — no crossing boundaries
- [ ] No god objects combining UI interaction, assertions, and data setup

**Open/Closed:**
- [ ] Base classes (`BasePage`, `BaseAsserter`, `BaseMap`, `BaseTestFlow`) only extended — never modified for a subclass

**Liskov Substitution:**
- [ ] `assertThat()` returns concrete subtype (`ExamplePageAsserter`), not `BaseAsserter`
- [ ] `steps()` returns concrete subtype, not `BasePageStep`

**Interface Segregation:**
- [ ] Fixture interfaces typed narrowly — no unused fixtures in test destructured parameters

**Dependency Inversion:**
- [ ] Flows depend on `BrowserSessionManager` — never on raw `Page`, `Browser`, or `BrowserContext`
- [ ] Page objects depend on `BaseMap` interface — concrete map only in owning page's constructor

**General:**
- [ ] No feature envy — methods operating on another class's data belong on that class
- [ ] Constructor uses named parameter object when >3 parameters
- [ ] No circular dependencies between modules
- [ ] New abstractions follow existing patterns

---

### I. DESIGN PATTERNS IN USE

**Proxy (lazy loading):**
- [ ] `BrowserUserSession.apis.*` and `.pages.*` accessed directly via proxy — never pre-instantiated with `new`

**Builder:**
- [ ] Every `testDetails()` chain ends with `.apply()` — omitting returns builder object, not `TestDetails`
- [ ] Builder chains built in one expression — not stored partially

**Facade:**
- [ ] `GamdomApiDbFacade` used for combined API+DB operations — not re-coordinated ad-hoc
- [ ] No bypassing facade when method already exists

**Factory (auth):**
- [ ] Auth factory matched to scenario: `storageStateNewUserDB()` for fresh user, `storageStateUserAPI()` for existing user, `storageStateNewSuperAdminUserDB()` for admin
- [ ] `test.use(storageState*())` at `describe` level — never inside `test()` body

**Object Factory (TDML):**
- [ ] DTOs via `testDataObject.*.build()` / `.default()` / `.preconfigured()` / `.random()` — never inline object literals
- [ ] Factory variant chosen correctly: `default()` stable, `preconfigured()` named scenarios, `random()` per-iteration, `build()` one-off overrides

**Strategy:**
- [ ] One auth strategy per `describe` block — no mixed `storageState*` functions

**Template Method:**
- [ ] `navigate()` via `super.navigate(...)` — not reimplemented with raw `page.goto()`
- [ ] `assertThat()` and `steps()` never bypassed — always via class method

---

### L. BROWSER SESSION MANAGEMENT

> Verify all rules from `.claude/rules/fixtures.md` (auth patterns, `loginAs` options, session object API). Additional review-specific checks:

- [ ] `loginAs(role, { reuseContext: true })` when logging in on existing context — omitting silently creates redundant context
- [ ] Multi-user tests use separate `loginAs()` calls without `reuseContext` for isolated contexts
- [ ] `browserSessionManager.active` / `activeUser` / `activeRole` for current session — not cached references
- [ ] API clients via `session.apis.gamdomApi` — no manual cookie passing
- [ ] `userBalanceHandler` via `session.userBalanceHandler()` — lazy-loaded
- [ ] Page fixtures use `sessionAwarePage(PageClass)` — never `new PageClass(page)`
