You are a senior test automation engineer performing a thorough code review on this Playwright/TypeScript E2E project (Gamdom E2E). Your goal is to identify issues **before merge**, grouped by severity and category.

---

## ARGUMENTS

This command accepts an optional branch name:

```
/pr-review                     # reviews the currently checked-out branch
/pr-review my-feature-branch   # reviews the specified branch without checking it out
```

The argument is available as `$ARGUMENTS`. If `$ARGUMENTS` is non-empty, treat it as the target branch name and use it in place of `HEAD` throughout — e.g., `git diff master...$ARGUMENTS`. You do **not** need to check out that branch; all git commands work against the branch ref directly.

---

## STEP 0 — Safety check

**Determine the target branch:**
- If `$ARGUMENTS` is non-empty: target = `$ARGUMENTS`. Skip the `main`/`master` and detached HEAD checks below (those only apply to the working checkout).
- If `$ARGUMENTS` is empty: run `git branch --show-current` to get the current branch name and use that as target.

**If no argument was passed and the current branch is `main` or `master`:** stop and tell the user:

> "You are on the `main`/`master` branch. Either pass a branch name (`/pr-review my-branch`) or checkout your feature branch first, then re-run `/pr-review`."

**If no argument was passed and `git branch --show-current` returns empty** (detached HEAD): stop and tell the user:

> "You appear to be in a detached HEAD state. Pass the branch name explicitly (`/pr-review my-branch`) or checkout your feature branch first, then re-run `/pr-review`."

**Otherwise** — proceed to STEP 1 with the resolved target branch.

---

## STEP 1 — Gather context

First, sync the local `master` ref so the diff is accurate:

```bash
git fetch origin master
```

If `git fetch` fails (e.g., no network or no `origin` remote), print a warning and continue:

> "⚠️ Could not fetch origin/master — diffing against the local master ref, which may be stale. Results could miss changes merged to master since your last fetch."

Then run:

```bash
git diff master...<target-branch>
git diff master...<target-branch> --name-only
```

where `<target-branch>` is the branch resolved in STEP 0.

**If `--name-only` returns no output** (empty diff), stop and tell the user:

> "The diff against `master` is empty — no changed files detected. Possible causes: the branch may already be merged, it has no commits ahead of `master`, or the branch name is wrong. Verify and re-run."

Always read `CLAUDE.md` — it applies to every review. Then read **only the rule files relevant to the changed paths**:

| Read this rule file | When the diff contains… |
|---|---|
| `.claude/rules/anti-patterns.md` | any changed file (always read) |
| `.claude/rules/pom-pattern.md` | `pages/**`, `fixtures/*pages*`, `fixtures/*components*`, `fixtures/*modal*` |
| `.claude/rules/test-structure.md` | `tests/**` |
| `.claude/rules/test-flows.md` | `test-flows/**` |
| `.claude/rules/test-data.md` | `test-data/**`, `dtos/**` |
| `.claude/rules/fixtures.md` | `fixtures/**` |
| `.claude/rules/api-and-db.md` | `api/**`, `db/**`, `services/**` |

Then read every changed file in full.

---

## STEP 1.5 — Determine active review sections

Based on the changed file paths from `--name-only`, decide which checklist sections are active for this review. **Skip any section whose trigger paths are not present in the diff** — do not apply those checks and do not include those sections in the report.

| Section | Active when diff contains… |
|---|---|
| A — Architecture & Imports | any `.ts` file |
| B — Test Structure & Metadata | `tests/**` |
| C — Page Object Model | `pages/**`, `fixtures/*pages*`, `fixtures/*components*`, `fixtures/*modal*` |
| D — Decorators | `pages/**`, `test-flows/**` |
| E — Waits & Timing | `pages/**`, `tests/**`, `test-flows/**` |
| F — Async / Error Handling | any `.ts` file |
| G — TypeScript Quality | any `.ts` file |
| H — OOP / SOLID | `pages/**`, `test-flows/**`, `fixtures/**` |
| I — Design Patterns | `pages/**`, `test-flows/**`, `fixtures/**`, `tests/**` |
| J — Logging & Observability | any `.ts` file |
| K — Assertions | `pages/**`, `tests/**`, `test-flows/**` |
| L — Browser Session Management | `tests/**`, `fixtures/**`, `test-flows/**` |
| M — Test Flows | `test-flows/**` |
| N — Test Data Management Layer | `test-data/**`, `dtos/**`, `tests/**` |
| O — API & Database | `api/**`, `db/**`, `services/**` |
| P — Security | any file |
| Q — Playwright UI Best Practices | `pages/**`, `tests/**` |
| R — Playwright API Testing | `api/**`, `tests/**` |
| S — Code Style & Formatting | any file |
| T — DRY & Code Duplication | any `.ts` file |
| U — Test Design Quality | `tests/**` |
| V — Test Cleanup & Data Isolation | `tests/**`, `fixtures/**` |
| W — CI/CD & GitHub Actions | `.github/workflows/**` |
| X — Dead Code & Orphaned Artifacts | any `.ts` file |
| Y — Naming Quality | any `.ts` file |

At the top of the STEP 2 output, list which sections are **active** and which are **skipped**, e.g.:

> **Active sections:** A, F, G, J, P, S, W, X, Y
> **Skipped (no matching paths):** B, C, D, E, H, I, K, L, M, N, O, Q, R, T, U, V

---

## STEP 2 — Review each file against ALL of the following checks

---

### A. PROJECT ARCHITECTURE & IMPORTS

- [ ] Test files import `test` from `@fixtures/fixtures` — **never** from `@playwright/test`
- [ ] All imports use path aliases (`@api/*`, `@pages/*`, `@core/*`, `@enums/*`, `@fixtures/*`, `@constants/*`, `@dtos/*`, `@test-flows/*`, `@base/*`) — no relative cross-directory imports
- [ ] No hardcoded URLs — use `configuration.ts` or `@constants/page-endpoints`
- [ ] No hardcoded credentials, API keys, or secrets — use `process.env` via `configuration.ts`
- [ ] Configuration centralised in `configuration.ts`, not scattered across files
- [ ] Import order: external packages first, then path-aliased project imports — no mixing within groups

---

### B. TEST STRUCTURE & METADATA

- [ ] Every `test()` has `testDetails().withTags(...).withAuthor(...).apply()` as second argument
- [ ] Every `test.describe()` has `testDetails().withTags(...).apply()` as second argument
- [ ] Test names follow `[ENG-{ticket}] Description` format
- [ ] Tags come from `TestTag` enum or `JiraComponent` enum — no raw tag strings
- [ ] `withAuthor()` uses `JiraUser` enum — no raw strings
- [ ] `withJiraBugTickets("ENG-xxx")` used for tests covering known bugs (auto-disables retries for that test)
- [ ] `@sequential` tag present whenever `test.describe.configure({ mode: "serial" })` is used — both required together
- [ ] `test.slow()` used only on non-deterministic game tests (play-until-win/loss loops) — not as a flakiness workaround
- [ ] `test.fixme(isScheduledRun, "reason")` used for conditional skips — not `test.skip()`
- [ ] No shared mutable state between tests — all setup done inside `test.beforeEach` or within the test body
- [ ] Each test is self-contained — does not depend on data or state produced by another test
- [ ] Auth configured via `test.use(storageStateNewUserDB())` or equivalent at the `describe` level — never manually inside the test body
- [ ] Parametrized tests use `for...of`, not `forEach` with async callbacks
- [ ] Suite-level `testDetails()` on `test.describe()` combined with per-test `testDetails()` on `test()` where different tags are needed — both levels populated

---

### C. PAGE OBJECT MODEL — FOUR-FILE PATTERN

- [ ] Each UI feature is split into exactly four files: `*-page-map.ts`, `*-page.ts`, `*-page-asserter.ts`, `*-page-steps.ts`
- [ ] **Map file** contains only locators — no actions, no assertions, no logic whatsoever
- [ ] **Page file** contains only actions and navigation — no locators, no assertions
- [ ] **Asserter file** contains only `expect(...)` assertions — no actions, no locators
- [ ] **Steps file** contains only multi-step orchestration sequences — no assertions, no locators
- [ ] Locator strategy priority (most to least preferred):
  1. `getByRole` — closest to how users and assistive technology perceive the page (W3C ARIA)
  2. `getByLabel` — for form inputs with associated labels
  3. `getByPlaceholder` — for inputs without labels
  4. `getByTestId` — explicit testing contract, most resilient to copy/design changes
  5. `getByText` — only for non-interactive elements; avoid for elements whose copy changes often
  6. `getByAltText` / `getByTitle` — for images and titled elements
  7. `locator` with concise attribute selector — when no built-in locator fits
  8. XPath — absolute last resort only; never absolute paths or wildcard attribute selectors
- [ ] `.nth()`, `.first()`, `.last()` avoided — DOM reorders break these; use `.filter({ hasText })`, `.filter({ has: locator })`, or chained semantic locators
- [ ] `{ exact: true }` passed to `getByRole` / `getByText` when partial matching could hit the wrong element (e.g., "Submit" vs "Submit Form")
- [ ] Locators scoped to parent containers — no broad page-level selectors when a container is available
- [ ] Complex CSS/XPath selectors avoided — no long hierarchy chains (`div > ul > li:nth-child(3) > a`), no wildcard attribute selectors (`//*[@*="value"]`)
- [ ] `.and(otherLocator)` used to narrow a locator when an element must satisfy two independent conditions simultaneously
- [ ] `.or(otherLocator)` used to handle optional UI states (e.g., cookie banner, confirm dialog that may or may not appear)
- [ ] `.filter({ hasNotText })` / `.filter({ hasNot: locator })` used to exclude elements rather than relying on index
- [ ] Locators in map files resolve dynamically on each use — never pre-resolved with `await locator.elementHandle()` or `await locator.all()` in the map
- [ ] Pages extend `BasePage<TMap>`, asserters extend `BaseAsserter<TPage>`, steps extend `BasePageStep<TPage>`
- [ ] Page constructor calls `super(page, new PageMap(page))`
- [ ] `assertThat()` overridden and returns the correct asserter instance
- [ ] `steps()` returns the correct steps instance
- [ ] No `page.locator()` / `page.getByTestId()` calls directly inside page/asserter/steps files — all locators accessed via `this.map.*` or `this.gamdomPage.map.*`
- [ ] Strict mode respected — if a locator unintentionally matches multiple elements and the action needs exactly one, the locator is made more specific rather than using `.first()`

---

### D. `@step()` AND `@testFlow()` DECORATORS

- [ ] Every **public** method in `*-page.ts`, `*-page-asserter.ts`, `*-page-steps.ts` has `@step()` decorator
- [ ] Every **public** method in test flow classes has `@testFlow()` decorator — steps appear prefixed with `FLOW:` in reports
- [ ] `@step("Custom message")` used when the auto-generated name from camelCase would be unclear to a reader of the report
- [ ] No `@step()` or `@testFlow()` on private or protected methods
- [ ] Decorator imports come from `@decorators/step` or `@decorators/test-flow`

---

### E. WAITS & TIMING (Anti-Flakiness)

> Assertion correctness (web-first assertions, `toPass`, `poll`, negative assertion pitfalls) is covered in **section K**. This section covers only timing and synchronisation.

- [ ] `page.waitForTimeout()` is **never** used — rely on Playwright's built-in auto-wait, or use `waitUntilVisible()`, `waitForStableXPosition()`, `waitFor()` from `BaseMap`
- [ ] No `setTimeout` / `sleep` wrappers
- [ ] `waitForLoadState('networkidle')` not used — it causes flakiness with WebSockets and background APIs; use element-based waits instead
- [ ] Playwright auto-wait leveraged — Playwright checks visibility, stability, enabled, and event-receivability before every action; extra manual waits before `.click()` / `.fill()` etc. are redundant
- [ ] `page.waitForResponse(predicate)` called **before** the action that triggers the response, not after — avoids race conditions:
  ```typescript
  // ✅ Correct
  const responsePromise = page.waitForResponse(r => r.url().includes('/api/data'));
  await page.getByRole('button').click();
  const response = await responsePromise;

  // ❌ Wrong — response may have already arrived
  await page.getByRole('button').click();
  const response = await page.waitForResponse(r => r.url().includes('/api/data'));
  ```
- [ ] Assertions in parallel-safe tests do not rely on row index or fixed position — use `some()` check or unique identifiers in environments where concurrent tests may add data
- [ ] Navigation awaited correctly — `navigate()` from `BasePage` used instead of raw `page.goto()`

---

### F. ASYNC / ERROR HANDLING

- [ ] All async operations use `async/await` — `.then()` and `.catch()` are **forbidden** (ESLint-restricted)
- [ ] All thrown values are `Error` objects — `throw new Error(...)`, never `throw "string"` or `throw { ... }`
- [ ] `try/catch` used where error handling is needed
- [ ] No unhandled floating promises — every `await`-able call is awaited
- [ ] Async functions return explicitly typed `Promise<T>` — never `Promise<any>` or implicit return type

---

### G. TYPESCRIPT QUALITY

- [ ] No `any` type — use specific types, generics, or `unknown` with type guards
- [ ] No type assertions (`as SomeType`) without a justification comment explaining why it is safe
- [ ] No non-null assertions (`!`) unless it is genuinely impossible to be null and a comment explains why
- [ ] Return types explicitly declared on all public methods
- [ ] Parameter objects typed with an `interface` or `type` — no repeated inline `{ foo: string; bar: number }` shapes
- [ ] `interface` used for object shapes / public APIs; `type` used for unions, intersections, and aliases
- [ ] `Record<K, V>` used instead of index signatures `{ [key: string]: V }` where key set is dynamic
- [ ] Utility types used appropriately: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Readonly<T>`
- [ ] `readonly` applied to class properties that should not be mutated after construction
- [ ] `const` used wherever a variable is not reassigned — not `let`
- [ ] Enums used for repeated string/number constants (game names, DB table/column names, endpoints, tags) — no magic strings
- [ ] No boxed primitive types (`String`, `Number`, `Boolean`, `Object`, `Function`) — use lowercase primitives and specific function signatures
- [ ] Unused variables prefixed with `_` (ESLint pattern `^_.`)
- [ ] Generic constraints correctly applied (`<T extends BaseMap>`, `<K extends keyof SomeType>`)
- [ ] Exhaustive `switch` cases use `never` type to catch unhandled variants at compile time
- [ ] Optional chaining (`?.`) and nullish coalescing (`??`) used appropriately — not `&&` chains or `|| default` when `null`/`undefined` distinction matters
- [ ] `satisfies` operator used where an object should be type-checked without widening its inferred type

---

### H. OOP / SOLID PRINCIPLES

**Single Responsibility**
- [ ] Each class has exactly one job: Page = actions/navigation, Asserter = assertions, Steps = orchestration sequences, Flow = business journeys — no class crosses these boundaries
- [ ] No god objects — a class that handles UI interaction, assertions, and data setup simultaneously violates SRP and must be split

**Open/Closed**
- [ ] Base classes (`BasePage`, `BaseAsserter`, `BaseMap`, `BaseTestFlow`) are only **extended** — never modified to accommodate a new subclass's special need; if a base class needs changing, that is a framework discussion, not a PR fix

**Liskov Substitution**
- [ ] `assertThat()` overrides return the **concrete subtype** (`ExamplePageAsserter`), not `BaseAsserter` — callers must be able to use the subtype wherever the base type is expected without losing behaviour
- [ ] `steps()` overrides return the **concrete subtype** (`ExamplePageSteps`), not `BasePageStep`

**Interface Segregation**
- [ ] Fixture interfaces typed narrowly — a test fixture should expose only what the test actually needs, not a large union of every page and API available
- [ ] No test receives a fixture it does not use — unused fixtures in a test's destructured parameters are dead weight

**Dependency Inversion**
- [ ] Flows depend on `BrowserSessionManager` (abstraction) — never on `Page`, `Browser`, or `BrowserContext` (concrete Playwright internals injected directly)
- [ ] Page objects depend on `BaseMap` interface — never construct or reference a concrete map class outside of the owning page's constructor

**General**
- [ ] No feature envy — a method primarily operating on another class's data should be moved to that class
- [ ] Constructor parameters use a named parameter object when >3 parameters — positional overload is unreadable at call sites
- [ ] No circular dependencies between modules — flows depend on pages, pages never depend on flows
- [ ] New abstractions follow existing patterns — no one-off base classes, mixins, or utility singletons that diverge from the framework

---

### I. DESIGN PATTERNS IN USE

**Proxy (lazy loading)**
- [ ] `BrowserUserSession.apis.*` and `.pages.*` are never pre-instantiated — access them directly via the proxy (e.g., `session.pages.homePage`) and let the proxy instantiate on first access; calling `new HomPage(page)` directly bypasses lazy loading and breaks session awareness

**Builder**
- [ ] Every `testDetails()` chain ends with `.apply()` — omitting `.apply()` returns the builder object itself, not a Playwright `TestDetails`, which silently passes no metadata to JIRA or ReportPortal
- [ ] Builder chains not partially constructed and stored — always build in one expression: `testDetails().withTags(...).withAuthor(...).apply()`

**Facade**
- [ ] `GamdomApiDbFacade` used for any operation that combines an API call with a DB query — not re-coordinated ad-hoc in tests or flows
- [ ] No bypassing the facade to call API + DB independently when the facade method already exists

**Factory (auth)**
- [ ] Auth factory matched to scenario: `storageStateNewUserDB()` for a fresh isolated user, `storageStateUserAPI()` for an existing user by username, `storageStateNewSuperAdminUserDB()` for admin — using the wrong factory produces wrong permissions or shared-user collisions
- [ ] `test.use(storageState*())` called at `describe` level — never inside `test()` body or `beforeEach`

**Object Factory (TDML)**
- [ ] DTOs constructed via `testDataObject.*.build()` / `.default()` / `.preconfigured()` / `.random()` — never with inline object literals that duplicate the DTO shape
- [ ] Factory variant chosen correctly: `default()` for stable values, `preconfigured()` for named scenarios, `random()` for unique per-iteration values, `build()` with overrides for one-off customisations

**Strategy**
- [ ] One auth strategy per `describe` block — `storageState*` functions not mixed within the same describe (e.g., new user and existing user strategies in the same block cause non-deterministic auth state)

**Template Method**
- [ ] `navigate()` called via `super.navigate(...)` from `BasePage` — not reimplemented in subclasses with raw `page.goto()`
- [ ] `assertThat()` and `steps()` never bypassed — always accessed through the class method, never instantiated directly in tests

**General**
- [ ] No ad-hoc patterns that diverge from the framework — new abstractions must follow existing patterns or be proposed as a framework change

---

### J. LOGGING & OBSERVABILITY

- [ ] `logger` from `@core/logger` used everywhere — no `console.log()`, `console.warn()`, or `console.error()` in any production test or framework file
- [ ] Log messages use the correct level: `logger.info` for normal flow, `logger.warn` for recoverable anomalies, `logger.error` for caught exceptions — not all piped through `logger.info`
- [ ] No sensitive data in log messages — passwords, tokens, PII, and wallet addresses must not appear in `logger.*` calls or `@step()` names (they appear in Playwright traces and ReportPortal)
- [ ] `@step("Custom label")` used when the auto-generated camelCase name would be ambiguous in the trace or ReportPortal report — step names are the primary debugging signal for failures
- [ ] `this.log()` used inside test flows (via `BaseTestFlow`) — not `logger` called directly, which would bypass the `[FLOW:FlowName]` prefix and break trace readability
- [ ] No `logger.*` calls inside map files — maps contain only locators; any diagnostic logging belongs in the page or steps file that calls the map
- [ ] Step names do not contain variable data that changes per run (e.g., `@step(\`click button \${id}\`)`  where `id` is a DB-generated value) — this fragments ReportPortal history and makes trend analysis useless; use a stable label and log the variable value separately

---

### K. ASSERTIONS — ADVANCED PATTERNS

> Timing-related issues (manual waits, `waitForResponse`, `networkidle`) are covered in **section E**. This section covers assertion correctness and patterns.

**Web-first / auto-retrying assertions**
- [ ] Web-first assertions used: `expect(locator).toBeVisible()` — **not** `expect(await locator.isVisible()).toBe(true)` (the awaited form snapshots once with no retry logic; the web-first form retries until timeout)
- [ ] Auto-retrying matchers (`toBeVisible`, `toHaveText`, `toHaveCount`, `toHaveValue`, etc.) preferred over generic Jest-style matchers (`toBe`, `toEqual`) for any DOM/page state — the former poll automatically; the latter do not

**Negative assertions**
- [ ] `toHaveCount(0)` used for "nothing is present" — **not** `not.toHaveCount(1)` (the negated form passes when there are 0 *or* 2+ elements, causing false positives in concurrent runs)
- [ ] `.not.toBeVisible()` used only for elements known to exist in the DOM but hidden — for elements that should not exist at all, use `toHaveCount(0)`

**Polling & groups**
- [ ] `expect(async () => { ... }).toPass({ timeout, intervals })` used for groups of assertions that may not pass immediately — not misused as a blanket flakiness workaround for a badly scoped locator
- [ ] `expect.poll(async () => { ... })` used only for a single polled value — not chained with web-first assertions (limitation of the API; mix causes the poll to stop retrying after first resolution)

**Assertion quality**
- [ ] Custom assertion messages provided when failure context would be unclear: `await expect(locator, 'should be logged in after redirect').toBeVisible()`
- [ ] `expect.soft(locator)` used when a test should continue collecting multiple failures rather than stopping at the first — results checked at end via `expect(test.info().errors).toHaveLength(0)` if needed
- [ ] `expect.configure({ timeout, soft })` used to create a reusable pre-configured `expect` instance instead of repeating options on every assertion
- [ ] Asymmetric matchers used for partial matching: `expect.objectContaining({})`, `expect.arrayContaining([])`, `expect.stringContaining()`, `expect.stringMatching()` — not full equality checks when only key fields matter
- [ ] Custom matchers added via `expect.extend()` only when the same assertion logic is reused in 3+ places — not for one-off checks
- [ ] `mergeExpects()` used when combining custom matchers from multiple modules (e.g., DB matchers + accessibility matchers)

---

### L. BROWSER SESSION MANAGEMENT

- [ ] `browserSessionManager.loginAs(role, { reuseContext: true })` used when logging in on the existing context/tab — omitting `reuseContext: true` silently opens a redundant browser context
- [ ] Multi-user tests use separate `loginAs()` calls without `reuseContext` — each gets its own isolated context and cookie jar
- [ ] `browserSessionManager.active`, `activeUser`, `activeRole` used to access the current session — not cached page/user references from outside the manager
- [ ] API clients accessed via `session.apis.gamdomApi` — no manual cookie passing; session handles auth internally
- [ ] `userBalanceHandler` accessed via `session.userBalanceHandler()` — lazy-loaded, reuses session-managed APIs
- [ ] `browserSessionManager.cleanup()` called in fixture teardown — already handled by the framework fixture; do not duplicate
- [ ] Page fixtures use `sessionAwarePage(PageClass)` — never `new PageClass(page)` with a raw Playwright page

---

### M. TEST FLOWS

- [ ] Flows used only for multi-page business journeys and complex orchestration — not for single-page actions
- [ ] Flows extend `BaseTestFlow` — use `this.log()` for logging inside flows, not `console.log()`
- [ ] Flows receive `BrowserSessionManager` in constructor — never raw `Page`, `Browser`, or `BrowserContext`
- [ ] No browser context creation inside flows — use `this.browserSessionManager.loginAs()`
- [ ] No duplication of Page Object logic inside flows — call `page.method()`, `page.steps().method()`, `page.assertThat().method()`
- [ ] Flow split follows responsibility boundaries: Setup → Action → Verification → Scenario (composes the others)
- [ ] Only **Scenario Flows** registered as Playwright fixtures and injected into tests — Setup/Action/Verification flows are internal dependencies
- [ ] `@testFlow()` decorator on every public flow method
- [ ] Flow results returned as strongly typed DTOs — not raw API responses or `any`
- [ ] Flows do not contain `expect()` directly — assertions delegated to asserter files via page objects
- [ ] No over-splitting: flows split by responsibility, not by line count — tiny one-liner flows are a smell

---

### N. TEST DATA MANAGEMENT LAYER

- [ ] Test data accessed via `testData()` or the appropriate fixture (`testDataPredefined`, `testDataPredefinedRandom`, `testDataRandom`, `testDataObject`) — never hardcoded inline in tests
- [ ] Correct source used for the data type:
  - `fromCsvRaw()` — raw CSV rows as DTOs, no transformation
  - `fromCsvParsed()` — CSV through a type-safe parser for normalized/computed values
  - `fromPredefined()` — static values stable across all runs (wallet type, default amounts)
  - `fromPredefinedRandom()` — values generated once per run with a prefix/schema (promo codes, usernames)
  - `fromRandom()` — new value on every invocation, for parametrized tests needing per-iteration uniqueness
  - `fromDomains()` — business-contextual scenario datasets per feature area
  - `fromObjects()` — factory-built, strongly typed DTOs via `build()` / `default()` / `preconfigured()` / `random()`
- [ ] No `Math.random()` or `Date.now()` inline for test data generation — use `testData().fromRandom()`
- [ ] New CSV files added to `CsvFilesName` enum and registered in `csv-dto-map.ts`
- [ ] New domain data classes registered in `test-data/domains/index.ts`
- [ ] New object factories extend `BaseTestDataObjectFactory` and registered in `test-data/objects/index.ts`
- [ ] Test data DTOs defined in `@dtos/*` — not as inline types inside test files
- [ ] `predefinedRandom` used for unique identifiers needed once per run; `random` used for unique identifiers needed per parametrized iteration — these are not interchangeable

---

### O. API & DATABASE (Project Layer)

- [ ] API classes extend `BaseApi` — no raw `fetch()` or `axios` calls anywhere
- [ ] DB queries go through `BaseDB` methods — no direct `pg` connections or raw SQL strings in test/flow files
- [ ] All DB queries use parameterised values (`$1`, `$2`, ...) — no string interpolation in SQL
- [ ] Table and column names use enums from `@enums/db/*` — no raw string literals for table/column names
- [ ] `withClient()` wrapper used for DB operations that need consistent error handling
- [ ] API responses checked for status codes before accessing body
- [ ] `GamdomApiDbFacade` used for combined API+DB operations — not ad-hoc coordination in tests

---

### P. SECURITY

- [ ] No credentials, passwords, tokens, or API keys hardcoded anywhere in the codebase
- [ ] All secrets read from `process.env` via `configuration.ts`
- [ ] No sensitive user data (passwords, PII, tokens) emitted via `logger.*` or step names
- [ ] No SQL injection risk — all DB queries parameterised
- [ ] Auth tokens not exposed in test names, step messages, or error messages
- [ ] `.env` files not committed — only `.env.example` if applicable

---

### Q. PLAYWRIGHT UI BEST PRACTICES

#### Actionability & Auto-Wait
- [ ] `page.$()` / `page.$$()` not used — deprecated, use `page.locator()`
- [ ] No manual waits before `.click()` / `.fill()` / `.check()` — Playwright auto-checks visibility, stability, enabled state, and event-receivability before every action
- [ ] `force: true` on actions used only when genuinely needed (e.g., programmatically triggering a hidden element) — never as a workaround for a flaky locator
- [ ] No `evaluate()` for things Playwright can do natively (click, fill, hover, check, select, drag)
- [ ] `page.keyboard.press()` / `page.keyboard.type()` used for keyboard interactions — not `evaluate()` to dispatch events manually

#### Locators (see also section C)
- [ ] Locators are **lazy** — defined without `await`, resolved fresh on every action/assertion
- [ ] `getByText()` used sparingly — text changes with copy updates; prefer `getByTestId` or `getByRole`
- [ ] Built-in semantic locators preferred over CSS class selectors — classes change, roles/test IDs are stable contracts
- [ ] CSS selectors, when necessary, are concise attribute-based selectors — not long DOM hierarchy chains
- [ ] XPath used only when no other strategy works — never absolute XPaths, never wildcard attribute selectors (`//*[@*="value"]`)
- [ ] Shadow DOM: all standard locators work automatically; XPath is the only exception and must be replaced

#### Network Mocking
- [ ] `page.route()` always cleaned up with `page.unroute()` or `await page.unrouteAll()` after the test or in `afterEach` — stale routes leak into subsequent tests
- [ ] `context.route()` used instead of `page.route()` when mocking must apply to popups or multiple pages within the same context
- [ ] `serviceWorkers: 'block'` set in config when using MSW or similar service-worker-based mocking tools — prevents service workers from intercepting routes before Playwright does
- [ ] URL patterns use `**` (matches `/`) not `*` (does not match `/`) when the path contains segments: `**/api/users**` not `*/api/users*`
- [ ] `page.route()` handlers return a response (`route.fulfill()`, `route.continue()`, or `route.abort()`) — unhandled routes cause request timeouts
- [ ] When modifying a real response, `route.fetch()` is awaited before transforming — the original response is preserved: `const response = await route.fetch(); await route.fulfill({ response, body: modified })`

#### Context & Isolation
- [ ] Tests do not share mutable browser state — each test starts with a clean context unless `reuseContext: true` is intentional
- [ ] Tests do not interact with third-party external sites — mock external dependencies with `page.route()`
- [ ] Visual regression tests use `toHaveScreenshot()` with committed baseline images and `--update-snapshots` only intentionally
- [ ] Parallel-safe assertions do not rely on absolute row index in grids/lists that other concurrent tests may modify

#### Fixtures (Playwright layer)
- [ ] Fixture names use only letters, numbers, and underscores — hyphens in names are not allowed by Playwright
- [ ] Long-running fixtures declare `{ timeout: N }` — they otherwise inherit the default test timeout and may cause confusing failures
- [ ] `{ box: true }` applied to internal helper fixtures whose steps should not pollute the test report
- [ ] Auto-use fixtures (`{ auto: true }`) used for global `beforeEach` / `beforeAll` equivalents — not repeated `test.beforeEach()` calls in every file
- [ ] Worker-scoped fixtures (`{ scope: 'worker' }`) used for expensive one-time setup (DB connections, API clients) — not re-created per test

---

### R. PLAYWRIGHT API TESTING

- [ ] API tests use the `request` fixture — it automatically inherits `baseURL`, `extraHTTPHeaders`, and other global config from `playwright.config.ts`
- [ ] `request.newContext()` used only when an isolated cookie jar is explicitly needed (pure API test that must not share state with the browser context) — disposed with `await context.dispose()` in `afterAll`
- [ ] Context type chosen correctly:
  - **Associated context** (`page.request` / `context.request`) — shares cookies with the browser context; use when an API call must be authenticated with the same session as the UI
  - **Isolated context** (`playwright.request.newContext()`) — independent cookies; use for pure API tests to avoid cross-contamination
- [ ] API preconditions set up via API before UI tests (faster and more reliable than driving UI to create state)
- [ ] API postconditions verified after UI actions to confirm server-side persistence
- [ ] `response.ok()` checked before accessing response body — not just `response.status()`
- [ ] API test cleanup done in `afterAll` (delete created resources) — not left as orphaned data
- [ ] Auth headers / bearer tokens set in `extraHTTPHeaders` in config or `request.newContext()` options — not hardcoded per-request
- [ ] `baseURL` configured in `playwright.config.ts` — not repeated as full URLs in every API call
- [ ] API-created test data uses unique identifiers (prefix + random suffix) — not static names that collide between parallel runs
- [ ] `expect(response.ok()).toBeTruthy()` used alongside body assertions — response status and body are both validated
- [ ] `storageState` exported and reused when API authentication needs to be shared with a browser context:
  ```typescript
  await requestContext.storageState({ path: 'state.json' });
  const context = await browser.newContext({ storageState: 'state.json' });
  ```

---

### S. CODE STYLE & FORMATTING

- [ ] Indentation: **tabs** (width 4) — not spaces
- [ ] Trailing commas on all multi-line arrays, objects, function parameters, and generics
- [ ] No trailing whitespace, no mixed indentation
- [ ] File and directory names use `kebab-case`
- [ ] Class names use `PascalCase`; methods and variables use `camelCase`; module-level constants use `SCREAMING_SNAKE_CASE`
- [ ] No commented-out code — use `// TODO: ENG-xxx reason` with ticket reference if deferral is needed
- [ ] No `console.log()` — use `logger` from `@core/logger`
- [ ] No barrel re-exports that create circular dependency chains

---

### T. DRY & CODE DUPLICATION

- [ ] No copy-pasted test bodies — identical or near-identical test blocks that differ only in one variable must be collapsed into a `for...of` parametrized loop
- [ ] No duplicated `test.beforeEach` / `test.afterEach` blocks across multiple spec files for the same setup — extract to a shared fixture or auto-use fixture
- [ ] No duplicated locator definitions across multiple `*-page-map.ts` files — if two maps define the same locator, it belongs in a shared base map or component map
- [ ] No duplicated action sequences across multiple `*-page.ts` or `*-page-steps.ts` files — extract to a shared steps method or a flow
- [ ] No duplicated assertion sequences across multiple `*-page-asserter.ts` files — extract to a shared asserter base method
- [ ] No duplicated API call + DB query patterns across tests or flows — use `GamdomApiDbFacade` or extract to a shared flow/helper
- [ ] No repeated magic strings used in 2+ places — define once as a constant, enum value, or test data entry
- [ ] No repeated numeric literals (amounts, timeouts, counts) used in 2+ places — define as a named constant at the top of the file or in `@constants/*`
- [ ] No copy-pasted `storageState` setup blocks — use the appropriate factory (`storageStateNewUserDB()`, `storageStateUserAPI()`, etc.) consistently
- [ ] No duplicated flow logic between a Setup/Action/Verification flow and the Scenario flow that composes them — the Scenario flow must delegate, not re-implement
- [ ] No copy-pasted DTO construction — use `testDataObject.*.build()` / `.default()` / `.preconfigured()` instead of repeating the same object literal inline
- [ ] No repeated `expect(locator).toBeVisible()` chains for the same set of elements in multiple asserter methods — extract to `checkElementsAreVisible([...])` from `BaseAsserter`

---

### U. TEST DESIGN QUALITY

**Single behaviour per test**
- [ ] Each test verifies **one** business behaviour — a test that asserts login, balance display, and transaction history in the same body should be three separate tests; failures become unambiguous and retries are cheaper
- [ ] No over-assertion — asserting the same condition with two different matchers in the same test, or asserting implementation details irrelevant to the user scenario (e.g., exact API response shape when only the UI outcome matters)
- [ ] Test scope matches the test name — if the name says "balance decreases after placing a bet", the test must not also assert unrelated UI elements like the chat panel

**AAA structure**
- [ ] Arrange / Act / Assert sections are clearly separated by a blank line — setup, action, and assertion blocks must not be interleaved within the test body
- [ ] No assertions before the action under test — precondition checks belong in `beforeEach` or a setup flow, not inline before the action

**Coverage breadth**
- [ ] Negative and boundary cases exist alongside happy path — a test file covering only success scenarios is incomplete; at minimum cover: invalid input, empty state, and permission-denied where applicable
- [ ] Boundary values tested for numeric inputs (minimum bet, maximum bet, zero, negative) — not just a single mid-range value

**Test names describe behaviour**
- [ ] Test names describe the **expected outcome** from a user perspective: `"balance decreases after placing a losing bet"` — not implementation: `"calls deductBalance API"` or `"verifyBalanceDecrement"`
- [ ] Test name is falsifiable — a name like `"test user flow"` gives no information about what passes or fails; the name must encode the condition being verified

---

### V. TEST CLEANUP & DATA ISOLATION

- [ ] Every DB record created during a test (user, transaction, promo code, bet, feature flag override) is deleted in `afterEach` or `afterAll` — no dirty data left that could poison parallel or sequential runs
- [ ] Write operations use `storageStateNewUserDB()` — not a shared user account; tests that mutate state (place bets, deposit, withdraw) must run as a fresh isolated user
- [ ] `afterAll` in API tests deletes all resources created by the test suite — not left as orphaned DB rows or API-created entities
- [ ] No test relies on another test having previously created its preconditions — each test creates its own state independently
- [ ] Feature flag overrides applied in `global-setup.ts` are cleaned up in `global-teardown.ts` — not left enabled after the suite finishes
- [ ] No `page.route()` stale mocks leaking between tests — all routes registered in a test are unregistered in `afterEach` or via `page.unrouteAll()`
- [ ] Test data with unique identifiers (usernames, promo codes, wallet addresses) uses a run-scoped prefix so parallel CI runs do not collide on the same names

---

### W. CI/CD & GITHUB ACTIONS

> Read this section only when `.github/workflows/**` files are among the changed paths.

- [ ] Cron expressions use `1-5` (Mon–Fri) or explicit day ranges — never `*` for day-of-week on nightly runs unless weekend execution is intentional and justified with a comment
- [ ] Cron schedule includes an inline comment documenting the timezone (GitHub Actions cron runs in UTC) and the business reason for the chosen time — e.g., `# 03:00 UTC Mon–Fri`
- [ ] No hardcoded secrets, tokens, or credentials in workflow YAML — all sensitive values referenced via `${{ secrets.SECRET_NAME }}`
- [ ] New secrets used in a workflow are declared in `workflow_call.secrets` if the workflow is reusable — callers cannot pass undeclared secrets
- [ ] `workflow_call` trigger present on workflows that are reused by other workflows — `workflow_dispatch` alone is not sufficient for reusability
- [ ] `runs-on` uses the project's self-hosted runner label — not `ubuntu-latest` (public runner), which lacks the required environment variables and installed tools
- [ ] Job `timeout-minutes` set on long-running jobs — jobs without a timeout can hang indefinitely and block the runner queue
- [ ] Steps that can fail non-fatally use `continue-on-error: true` with a follow-up step that surfaces the failure — not silently swallowed
- [ ] Worker count (`--workers`) passed to Playwright matches the runner's capacity — not hardcoded to a value that overloads or underutilises the runner
- [ ] S3 report upload, Slack notification, and JIRA/XRay steps have `if: always()` or `if: failure()` conditions explicitly set — without them they are skipped on test failure, which is when the report is most needed
- [ ] Commit message prefix follows the repo convention: `[ENG-xxxxx]` for ticketed work, `[NO-TICKET]` (with hyphen) for untracked changes — bare `[NO TICKET]` (with space) breaks log grep patterns

---

### X. DEAD CODE & ORPHANED ARTIFACTS

- [ ] No `test.skip()` without a JIRA ticket reference in the reason string — bare skips are invisible tech debt with no resolution path
- [ ] No `test.fixme()` without a condition and a reason string — bare `test.fixme()` skips the test unconditionally and silently forever
- [ ] No disabled test blocks (`test.describe.skip(...)`) older than the current sprint without a linked ticket
- [ ] Unused fixture definitions removed — a fixture declared in a fixture file but used by zero tests should be deleted
- [ ] Unused imports removed — not just prefixed with `_`; dead imports increase parse overhead and confuse readers
- [ ] New POM files registered in the appropriate fixture file — an `*-page.ts` with no corresponding `sessionAwarePage(PageClass)` fixture is unreachable from tests
- [ ] New flow classes registered in the flows fixture file — a flow not exposed as a fixture cannot be injected into tests
- [ ] New enum values, constants, and DTO types are actually used by the code introduced in the same PR — if not yet used, they should not be added yet
- [ ] No commented-out test code — if a test is temporarily disabled it must use `test.fixme(condition, "ENG-xxx reason")`

---

### Y. NAMING QUALITY

**Page objects**
- [ ] Page action method names are **action-oriented verbs**: `clickSubmit`, `fillUsername`, `selectWallet`, `openDepositModal` — not nouns (`submitButton`), gerunds (`submitting`), or generic prefixes (`handleClick`, `doFill`, `performAction`)
- [ ] Asserter method names describe **expected state** as a predicate or noun phrase: `isLoggedIn`, `errorMessageIsVisible`, `balanceEquals`, `depositsTableIsEmpty` — not generic: `checkLogin`, `verifyError`, `assertBalance`
- [ ] Steps method names describe a **multi-step sequence outcome**: `fillAndSubmitLoginForm`, `selectWalletAndEnterAmount` — not single-action names that belong on the page file

**Flows**
- [ ] Flow method names describe a **business scenario**: `placeBetAndVerifyBalance`, `depositViaWalletAndConfirmTransaction` — not technical operations (`executeBet`, `runDepositFlow`, `doScenario`)

**Variables & parameters**
- [ ] Boolean variables and return types named as predicates: `isVisible`, `hasBalance`, `canWithdraw`, `isScheduledRun` — not `visibility`, `balanceStatus`, `withdrawalState`
- [ ] No meaningless generic names in non-trivial scope: `data`, `result`, `response`, `obj`, `item`, `value` — use a precise name that encodes what the value represents (`betResponse`, `userBalance`, `promoCodeRecord`)
- [ ] Loop variables in `for...of` parametrized tests named after what each record represents: `for (const betRecord of records)` — not `for (const item of records)` or `for (const r of records)`

**Files & classes**
- [ ] File names match their exported class exactly: `dice-game-page.ts` exports `DiceGamePage`, `dice-game-page-map.ts` exports `DiceGamePageMap` — no mismatches between file name and class name
- [ ] No abbreviations in public API names unless they are universally understood in the domain (`url`, `api`, `db`, `id`) — `usrBal` and `pmoCd` are not acceptable

---

## STEP 3 — Write the report file

Assign a sequential number to every issue found, starting from **#1**. Numbers never reset between severity groups.

Write the full report to **`pr-review-report.md` in the project root** using the Write tool. The file must contain:

1. A header with the branch name, date, and PR title (from git log)
2. The severity legend table (copy from below)
3. Every issue in the format below — ordered 🔴 first, then 🟠, then 🟡
4. The decision table
5. The "How to apply fixes" instruction

---

### Severity levels

| Level | Label | Meaning |
|---|---|---|
| 🔴 | **BLOCKING** | Must be fixed before merge. Will cause a test failure, flakiness, security vulnerability, broken JIRA/ReportPortal reporting, or a violation so fundamental it corrupts the architecture for future contributors. Non-negotiable. |
| 🟠 | **IMPORTANT** | Should be fixed before merge. Does not break anything today but creates real maintenance burden, introduces inconsistency that will confuse future contributors, or will likely become a bug or flakiness source under load or parallel runs. Strong recommendation to fix. |
| 🟡 | **SUGGESTION** | Nice to have. No immediate risk. Improves readability, naming clarity, or alignment with conventions. Perfectly acceptable to defer to a follow-up ticket. |

---

### Issue format (write this for every issue inside the report file)

```
---

**#N** · 🔴 BLOCKING / 🟠 IMPORTANT / 🟡 SUGGESTION

**File:** `path/to/file.ts:line`
**Rule section:** A / B / C / ... / S / T
**Violation:** Short name of the broken rule
**Why this severity:** One sentence — concrete consequence if left unfixed.
**Current code:**
\`\`\`typescript
// exact snippet from the file
\`\`\`
**Fix:**
\`\`\`typescript
// corrected version, ready to apply
\`\`\`
```

---

### Decision table (write this at the end of the report file)

| # | Severity | File | Violation |
|---|---|---|---|
| 1 | 🔴 BLOCKING | `path/to/file.ts:42` | Missing `testDetails()` |
| 2 | 🟠 IMPORTANT | `path/to/file.ts:87` | `any` type on return value |
| 3 | 🟡 SUGGESTION | `path/to/file.ts:12` | Unused import |

---

### "How to apply fixes" section (write this at the very end of the report file)

> Reply with the issue numbers to fix (e.g., **"fix #1, #3, #5"**) and only those changes will be applied — nothing else will be touched.

---

## STEP 4 — Output to chat (concise)

After writing the file, output **only** the following to the chat — nothing more:

---

**Report written to [`pr-review-report.md`](pr-review-report.md)**

### Summary
- **Total:** X 🔴 blocking · Y 🟠 important · Z 🟡 suggestions
- **Hotspot:** File or section with the most issues
- **Verdict:** ✅ Ready to merge / ⚠️ Fix important issues first / ❌ Blocking issues must be resolved

### How to apply fixes
Open [`pr-review-report.md`](pr-review-report.md) to see all issues with code snippets and fixes. Reply with the numbers you want applied — e.g., **"fix #1, #3, #5"** — and only those changes will be made.

> `pr-review-report.md` is gitignored and will not be committed accidentally. Delete it after use if you no longer need it, or keep it locally as a reference — it will never appear in `git status`.
