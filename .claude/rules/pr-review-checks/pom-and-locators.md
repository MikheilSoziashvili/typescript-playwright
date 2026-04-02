# POM, Decorators & Playwright UI Checks (C + D + Q)

> Active when the diff contains `pages/**`, `fixtures/*pages*`, `fixtures/*components*`, or `fixtures/*modal*`.

---

### C. PAGE OBJECT MODEL — FOUR-FILE PATTERN

> Verify all rules from `.claude/rules/pom-pattern.md` (four-file split, base classes, locator strategy, asserter wrappers). Additional review-specific checks:

- [ ] **Map file** contains only locators — no actions, no assertions, no logic
- [ ] **Page file** contains only actions and navigation — no locators, no assertions
- [ ] **Asserter file** contains only assertions — no actions, no locators
- [ ] **Steps file** contains only multi-step orchestration — no assertions, no locators
- [ ] Locator strategy priority followed (most to least preferred):
  1. `getByRole` 2. `getByLabel` 3. `getByPlaceholder` 4. `getByTestId` 5. `getByText` 6. `getByAltText`/`getByTitle` 7. `locator` with attribute selector 8. XPath (last resort)
- [ ] `.nth()`, `.first()`, `.last()` avoided — use `.filter({ hasText })`, `.filter({ has: locator })`, or chained semantic locators
- [ ] `{ exact: true }` passed to `getByRole` / `getByText` when partial matching risks exist
- [ ] Locators scoped to parent containers — no broad page-level selectors
- [ ] No long CSS/XPath hierarchy chains — no `div > ul > li:nth-child(3) > a`
- [ ] `.and()` / `.or()` / `.filter({ hasNot })` used appropriately for narrowing/excluding
- [ ] Locators resolve dynamically — never pre-resolved with `elementHandle()` or `all()` in map
- [ ] Pages extend `BasePage<TMap>`, asserters extend `BaseAsserter<TPage>`, steps extend `BasePageStep<TPage>`
- [ ] `assertThat()` overridden, returns correct asserter instance
- [ ] `steps()` returns correct steps instance
- [ ] No `page.locator()` / `page.getByTestId()` directly in page/asserter/steps — use `this.map.*` or `this.gamdomPage.map.*`
- [ ] Strict mode: locator matching multiple elements made more specific rather than using `.first()`

---

### D. `@step()` AND `@testFlow()` DECORATORS

- [ ] Every **public** method in `*-page.ts`, `*-page-asserter.ts`, `*-page-steps.ts` has `@step()` decorator
- [ ] Every **public** method in test flow classes has `@testFlow()` decorator
- [ ] `@step("Custom message")` used when auto-generated name would be unclear
- [ ] No decorators on private or protected methods
- [ ] Decorator imports from `@decorators/step` or `@decorators/test-flow`

---

### Q. PLAYWRIGHT UI BEST PRACTICES

**Actionability & Auto-Wait:**
- [ ] `page.$()` / `page.$$()` not used — use `page.locator()`
- [ ] No manual waits before `.click()` / `.fill()` / `.check()` — Playwright auto-waits
- [ ] `force: true` only when genuinely needed — never as flakiness workaround
- [ ] No `evaluate()` for things Playwright can do natively (click, fill, hover, check, select, drag)

**Network Mocking:**
- [ ] `page.route()` cleaned up with `page.unroute()` or `page.unrouteAll()` after test
- [ ] URL patterns use `**` (matches `/`) not `*` for paths with segments
- [ ] Route handlers return a response (`route.fulfill()`, `route.continue()`, or `route.abort()`)

**Context & Isolation:**
- [ ] Tests don't share mutable browser state
- [ ] Parallel-safe assertions don't rely on absolute row index in shared UI surfaces

**Fixtures (Playwright layer):**
- [ ] Fixture names use only letters, numbers, underscores — no hyphens
- [ ] Long-running fixtures declare `{ timeout: N }`
- [ ] `{ box: true }` on internal helper fixtures to avoid polluting report
- [ ] Worker-scoped fixtures for expensive one-time setup (DB, API clients)
