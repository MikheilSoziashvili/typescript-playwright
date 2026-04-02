# Test Data, API & Database Checks (N + O + R)

> Active when the diff contains `test-data/**`, `dtos/**`, `api/**`, `db/**`, or `services/**`.

---

### N. TEST DATA MANAGEMENT LAYER

> Verify all rules from `.claude/rules/test-data.md` (data sources, CSV pipeline, factories). Additional review-specific checks:

- [ ] Test data via `testData()` or appropriate fixture — never hardcoded inline
- [ ] Correct source selected:
  - `fromCsvRaw()` / `fromCsvParsed()` — CSV-driven
  - `fromPredefined()` — static stable values
  - `fromPredefinedRandom()` — unique per run
  - `fromRandom()` — unique per invocation
  - `fromDomain()` — business scenario datasets
  - `fromObjects()` — factory DTOs (`build` / `default` / `preconfigured` / `random`)
- [ ] No `Math.random()` or `Date.now()` inline — use `testData().fromRandom()`
- [ ] New CSV files added to `CsvFilesName` enum and `csv-dto-map.ts`
- [ ] New domain data classes registered in `test-data/domains/index.ts`
- [ ] New object factories extend `BaseTestDataObjectFactory` and registered in `test-data/objects/index.ts`
- [ ] DTOs in `@dtos/*` — not inline types in test files

---

### O. API & DATABASE

> Verify all rules from `.claude/rules/api-and-db.md` (BaseApi, BaseDB, pool service). Additional review-specific checks:

- [ ] API classes extend `BaseApi` — no raw `fetch()` or `axios`
- [ ] DB queries via `BaseDB` methods — no direct `pg` connections or raw SQL in test/flow files
- [ ] All DB queries use parameterised values (`$1`, `$2`) — no string interpolation in SQL
- [ ] Table/column names use enums from `@enums/db/*` — no raw string literals
- [ ] `withClient()` wrapper for DB operations needing error handling
- [ ] API responses checked for status before accessing body
- [ ] `GamdomApiDbFacade` for combined API+DB operations

---

### R. PLAYWRIGHT API TESTING

- [ ] API tests use `request` fixture — inherits `baseURL` and `extraHTTPHeaders` from config
- [ ] `request.newContext()` only when isolated cookie jar explicitly needed — disposed in `afterAll`
- [ ] Context type correct: `page.request` (shares browser cookies) vs `playwright.request.newContext()` (isolated)
- [ ] API preconditions set up via API before UI tests — faster than driving UI
- [ ] `response.ok()` checked before accessing body
- [ ] API test cleanup in `afterAll` — no orphaned data
- [ ] Auth headers in `extraHTTPHeaders` config — not hardcoded per-request
- [ ] API test data uses unique identifiers with run-scoped prefix
