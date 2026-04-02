# Test Authoring Checks (B + E + K + U + V)

> Active when the diff contains `tests/**`.

---

### B. TEST STRUCTURE & METADATA

> Verify all rules from `.claude/rules/test-structure.md` (imports, skeleton, `testDetails()`, auth patterns, CSV parametrization). Additional review-specific checks:

- [ ] Every `test()` has `testDetails().withTags(...).withAuthor(...).apply()` as second argument
- [ ] Every `test.describe()` has `testDetails().withTags(...).apply()` as second argument
- [ ] Test names follow `[ENG-{ticket}] Description` format
- [ ] Tags from `TestTag` / `JiraComponent` enums — no raw tag strings
- [ ] `withAuthor()` uses `JiraUser` enum
- [ ] `@sequential` tag present whenever `test.describe.configure({ mode: "serial" })` is used
- [ ] `test.slow()` only on non-deterministic game tests — not as flakiness workaround
- [ ] No shared mutable state between tests — setup in `beforeEach` or test body
- [ ] Each test is self-contained — no dependency on other tests' data/state
- [ ] Parametrized tests use `for...of`, not `forEach` with async callbacks
- [ ] `testDetails()` on both `describe` and `test` levels where different tags are needed

---

### E. WAITS & TIMING (Anti-Flakiness)

> Verify all rules from `.claude/rules/anti-patterns.md` (wait rules). Additional review-specific checks:

- [ ] `page.waitForTimeout()` never used — use Playwright auto-wait or `waitUntilVisible()` / `waitForStableXPosition()` / `waitFor()` from BaseMap
- [ ] No `setTimeout` / `sleep` wrappers
- [ ] `waitForLoadState('networkidle')` not used — unreliable with WebSockets
- [ ] `page.waitForResponse(predicate)` called **before** the triggering action, not after:
  ```typescript
  // Correct: promise created first, then action
  const responsePromise = page.waitForResponse(r => r.url().includes('/api/data'));
  await page.getByRole('button').click();
  const response = await responsePromise;
  ```
- [ ] Navigation uses `navigate()` from `BasePage` — not raw `page.goto()`

---

### K. ASSERTIONS — ADVANCED PATTERNS

> Verify all rules from `.claude/rules/base-asserter-methods.md` (BaseAsserter utility methods replace raw `expect()` in asserter files). Additional review-specific checks:

**Web-first assertions:**
- [ ] `expect(locator).toBeVisible()` — not `expect(await locator.isVisible()).toBe(true)` (snapshot form has no retry)
- [ ] Auto-retrying matchers (`toBeVisible`, `toHaveText`, `toHaveCount`) preferred over `toBe`/`toEqual` for DOM state

**Negative assertions:**
- [ ] `toHaveCount(0)` for "nothing present" — not `not.toHaveCount(1)` (passes when 0 or 2+)
- [ ] `.not.toBeVisible()` only for elements in DOM but hidden — for absent elements use `toHaveCount(0)`

**Polling & groups:**
- [ ] `.toPass({ timeout, intervals })` for assertion groups that may not pass immediately — not as blanket flakiness workaround
- [ ] `expect.poll()` for single polled value — not chained with web-first assertions

**Assertion quality:**
- [ ] Custom messages when failure context would be unclear
- [ ] `expect.soft()` when test should continue collecting multiple failures

---

### U. TEST DESIGN QUALITY

**Single behaviour per test:**
- [ ] Each test verifies one business behaviour — not login + balance + transaction in same body
- [ ] No over-assertion — same condition with two matchers, or asserting irrelevant implementation details
- [ ] Test scope matches name — "balance decreases" test doesn't also assert chat panel

**AAA structure:**
- [ ] Arrange / Act / Assert clearly separated by blank lines — not interleaved
- [ ] No assertions before the action under test — precondition checks belong in `beforeEach`

**Test names:**
- [ ] Describe expected outcome from user perspective: `"balance decreases after placing a losing bet"` — not `"calls deductBalance API"`
- [ ] Names are falsifiable — not `"test user flow"`

---

### V. TEST CLEANUP & DATA ISOLATION

- [ ] Every DB record created during test deleted in `afterEach` or `afterAll`
- [ ] Write operations use `storageStateNewUserDB()` or `loginAs` with fresh user — not shared accounts
- [ ] No test relies on another test's preconditions
- [ ] Feature flag overrides cleaned up in `global-teardown.ts`
- [ ] No stale `page.route()` mocks leaking — all routes unregistered in `afterEach`
- [ ] Test data uses unique identifiers with run-scoped prefix for parallel CI safety
