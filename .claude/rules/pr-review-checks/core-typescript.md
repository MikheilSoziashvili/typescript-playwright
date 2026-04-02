# Core TypeScript Review Checks (A + F + G + J + S + T + X + Y)

> Active when the diff contains any `.ts` file.

---

### A. PROJECT ARCHITECTURE & IMPORTS

> Also verify all rules from `.claude/rules/anti-patterns.md` (import rules, URL rules, code style).

- [ ] Test files import `test` from `@fixtures/fixtures` — never from `@playwright/test`
- [ ] All imports use path aliases (`@api/*`, `@pages/*`, `@core/*`, `@enums/*`, `@fixtures/*`, `@constants/*`, `@dtos/*`, `@test-flows/*`, `@base/*`) — no relative cross-directory imports
- [ ] No hardcoded URLs — use `configuration.ts` or `@constants/page-endpoints`
- [ ] No hardcoded credentials, API keys, or secrets — use `process.env` via `configuration.ts`
- [ ] Configuration centralised in `configuration.ts`
- [ ] Import order: external packages first, then path-aliased project imports

---

### F. ASYNC / ERROR HANDLING

- [ ] All async operations use `async/await` — `.then()` and `.catch()` forbidden (ESLint-restricted)
- [ ] All thrown values are `Error` objects — never `throw "string"` or `throw { ... }`
- [ ] No unhandled floating promises — every `await`-able call is awaited
- [ ] Async functions return explicitly typed `Promise<T>` — never `Promise<any>`

---

### G. TYPESCRIPT QUALITY

- [ ] No `any` type — use specific types, generics, or `unknown` with type guards
- [ ] No type assertions (`as SomeType`) without justification comment
- [ ] No non-null assertions (`!`) without justification comment
- [ ] Return types explicitly declared on all public methods
- [ ] Parameter objects typed with `interface` or `type` — no repeated inline shapes
- [ ] `interface` for object shapes; `type` for unions, intersections, aliases
- [ ] `readonly` on class properties not mutated after construction
- [ ] `const` wherever a variable is not reassigned
- [ ] Enums for repeated string/number constants — no magic strings
- [ ] No boxed primitive types (`String`, `Number`, `Boolean`, `Object`, `Function`)
- [ ] Unused variables prefixed with `_` (ESLint pattern `^_.`)
- [ ] Optional chaining (`?.`) and nullish coalescing (`??`) used appropriately

---

### J. LOGGING & OBSERVABILITY

- [ ] `logger` from `@core/logger` used — no `console.log()` / `console.warn()` / `console.error()`
- [ ] Correct log level: `logger.info` for normal flow, `logger.warn` for recoverable anomalies, `logger.error` for caught exceptions
- [ ] No sensitive data in log messages or `@step()` names (they appear in traces and ReportPortal)
- [ ] `@step("Custom label")` used when auto-generated camelCase name would be ambiguous
- [ ] Step names do not contain variable data that changes per run — fragments ReportPortal history

---

### S. CODE STYLE & FORMATTING

- [ ] Indentation: **tabs** (width 4) — not spaces
- [ ] Trailing commas on all multi-line arrays, objects, function parameters
- [ ] File and directory names use `kebab-case`
- [ ] Class names `PascalCase`; methods/variables `camelCase`; module-level constants `SCREAMING_SNAKE_CASE`
- [ ] No commented-out code — use `// TODO: ENG-xxx reason` if deferral needed
- [ ] No `console.log()` — use `logger`
- [ ] No barrel re-exports that create circular dependency chains

---

### T. DRY & CODE DUPLICATION

- [ ] No copy-pasted test bodies — identical blocks differing in one variable must use `for...of` parametrized loop
- [ ] No duplicated `beforeEach` / `afterEach` across spec files for same setup — extract to fixture
- [ ] No duplicated locator definitions across map files — extract to shared base/component map
- [ ] No duplicated action/assertion sequences across POM files — extract to shared method or flow
- [ ] No repeated magic strings in 2+ places — define as constant or enum
- [ ] No repeated numeric literals in 2+ places — define as named constant
- [ ] No repeated `expect(locator).toBeVisible()` chains — use `checkElementsAreVisible([...])`

---

### X. DEAD CODE & ORPHANED ARTIFACTS

- [ ] No `test.skip()` without a JIRA ticket reference in reason string
- [ ] No `test.fixme()` without condition and reason string
- [ ] Unused fixture definitions removed
- [ ] Unused imports removed — not just prefixed with `_`
- [ ] New POM files registered in fixture file — unregistered `*-page.ts` is unreachable
- [ ] New flow classes registered in flows fixture file
- [ ] New enum values, constants, DTOs actually used by code in the same PR

---

### Y. NAMING QUALITY

**Page objects:**
- [ ] Page action methods are action-oriented verbs: `clickSubmit`, `fillUsername`, `openDepositModal`
- [ ] Asserter methods describe expected state: `isLoggedIn`, `errorMessageIsVisible`, `balanceEquals`
- [ ] Steps methods describe multi-step sequence outcome: `fillAndSubmitLoginForm`

**Flows:**
- [ ] Flow methods describe business scenario: `placeBetAndVerifyBalance` — not `executeBet` or `doScenario`

**Variables:**
- [ ] Booleans named as predicates: `isVisible`, `hasBalance`, `canWithdraw`
- [ ] No meaningless generic names in non-trivial scope: `data`, `result`, `item` — use precise names
- [ ] Loop variables named after what each record represents: `for (const betRecord of records)`

**Files & classes:**
- [ ] File names match exported class exactly: `dice-game-page.ts` exports `DiceGamePage`
- [ ] No abbreviations in public API names unless universally understood (`url`, `api`, `db`, `id`)
