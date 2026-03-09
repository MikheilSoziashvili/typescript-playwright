# Anti-Patterns to Avoid

Project-specific rules — all derived from actual codebase conventions.

## Test structure

- **Do not import `test` from `@playwright/test`** in spec files — always from `@fixtures/fixtures`
- **Do not create tests without `testDetails()`** — missing metadata breaks JIRA and ReportPortal
- **Do not use `test.describe.configure({ mode: "serial" })` without `@sequential` tag** — tag required for routing to sequential project
- **Do not share mutable state between tests** — use `test.beforeEach` for per-test setup
- **Do not hardcode URLs** — use `configuration.ts` or `@constants/page-endpoints`

## Page Object Model

- **Do not put locators in page files** — locators belong exclusively in `*-page-map.ts`
- **Do not put assertions in page or steps files** — assertions belong in `*-page-asserter.ts`
- **Do not skip the `@step()` decorator** on public methods in POM files — breaks reporting
- **Do not instantiate page objects manually in tests** — use fixtures; pages need `browserSessionManager.active.page`

## Waits

- **Do not use `page.waitForTimeout()`** — use Playwright auto-wait, `waitUntilVisible()`, `waitForStableXPosition()`, or `waitFor()` from BaseMap

## Test Flows

- **Do not create browser contexts inside flows** — flows use `BrowserSessionManager`
- **Do not inject `page` directly into flows** — pass `BrowserSessionManager` in constructor
- **Do not duplicate Page Object logic in flows** — flows orchestrate, they don't re-implement
- **Do not use flows for simple page actions** — flows are for multi-page business journeys
- **Do not over-split flows into tiny methods** — split by responsibility (setup/action/verification/scenario)
- **Do not expose Setup/Action/Verification flows to tests** — only Scenario Flows are test fixtures

## Code style

- **Do not use `.then()` or `.catch()`** — ESLint-restricted; use async/await with try/catch
- **Do not throw non-Error objects** — `no-throw-literal` enforced as error
- **Do not use relative imports across directories** — always use path aliases (`@api/*`, `@pages/*`, etc.)
