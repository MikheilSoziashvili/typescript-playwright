# CLAUDE.md — Gamdom E2E

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright-based E2E test automation framework for the Gamdom web application (online casino/gaming platform). Uses a custom four-file Page Object Model, fixture-based dependency injection, a centralized Test Data Management Layer, a Test Flow Layer for business journeys, and integrates with JIRA, ReportPortal, Slack, and PostgreSQL.

## Tech Stack

- Runtime: Node.js 22+
- Language: TypeScript 5.8.3 (strict mode, ES2022, CommonJS)
- Test Framework: Playwright 1.58.0
- Package Manager: Yarn 4.5.3 (with Corepack)
- Database: PostgreSQL (via Express pool service)
- Linting: ESLint 9 (flat config) + Prettier
- Reporting: ReportPortal, JIRA/XRay, Slack, HTML, JUnit XML

## Commands

```bash
yarn install                                      # Install dependencies
npx playwright install                            # Install browsers (first time)
npx playwright test                               # Run all tests
npx playwright test tests/dice-game.spec.ts       # Run single test file
npx playwright test --grep "@smoke"               # Run by tag
npx playwright test --grep-invert "@sequential"   # Exclude tag
npx playwright test --project=chromium            # Specific project
npx playwright test --headed                      # Headed mode
yarn test-pretty                                  # Headed + pino-pretty logging
yarn lint                                         # ESLint
yarn lint:step-decorators                         # Check missing @step decorators
yarn lint:jira-components                         # Check missing JiraComponent tags
npx playwright show-report                        # Open HTML report
npx tsc --noEmit --pretty                         # Type check
```

## Architecture Layers

```
Test Spec         → WHAT is being verified
  ↓
Test Flow Layer   → HOW a scenario is executed (business journeys)
  ↓
Page Objects      → HOW to interact with UI (4-file POM)
  ↓
Playwright
```

## Code Style Rules

- **No redundant comments** anywhere in generated code — only FALLBACK/TODO annotations when truly needed
- **No comments** anywhere on locators or test steps — no FALLBACK, TODO, See Xray, or attachment annotations
- **Use base-asserter methods** (`checkElementsAreVisible`, `checkElementsContainText`, etc.) over raw `expect()` in asserter classes — see `.claude/rules/base-asserter-methods.md` for the full mapping
- **Always pass a meaningful custom message** to `expect()` and BaseAsserter helpers (`message`, `label` params) — failure logs must describe the expected state, not just dump the raw locator
- **No `assert` prefix** on asserter methods — use `connectionsPageIsDisplayed()` not `assertConnectionsPageIsDisplayed()`
- **Steps class**: only for methods combining actions + assertions (e.g., navigate then verify)
- **Asserter class**: pure assertion methods (no actions)
- **Page class**: pure action methods (no assertions)

## Page Inspection (playwright-cli)

- **Always ask which user type** before logging in to inspect a page: superadmin, default user1, or newly created DB user with specific tags
- Different users see different elements — never assume user type
- All predefined users are in `TestUserConfigurationObject` in `configuration.ts`

## New Test Creation

**JiraComponent** — resolved automatically, never guessed:
- If a scaffold `.md` exists (e.g. `tests/{TEST_KEY}-scaffold.md`), read the **Components** field and map each name to `JiraComponent.*` in `enums/jira/jira-components.ts` (case-insensitive). If a component is missing from the enum, add it directly to `enums/jira/jira-components.ts` before generating the spec.
- If no scaffold exists and no component context is available, **ask the user** which `JiraComponent.*` value(s) to use before generating any test.
- Do **not** use `TestTag.*` as a substitute for components — `JiraComponent.*` is always required.

**Author (`JiraUser.*`)** — resolved automatically from git config, never asked:

```bash
git config user.email
```

Map email prefix (part before `@`) to `JiraUser` enum:

| email prefix | JiraUser |
|---|---|
| svetoslav | `JiraUser.SVETOSLAV_LAZAROV` |
| angel | `JiraUser.ANGEL_PETROV` |
| ivaylo | `JiraUser.IVAYLO_STOYCHEV` |
| raluca | `JiraUser.RALUCA_ARITON` |
| nikolay | `JiraUser.NIKOLAY_GENOV` |

If no match → use `JiraUser.SVETOSLAV_LAZAROV` as default and note it.

**TestTag** — never emitted automatically. Leave a `// TODO: add .withTags(TestTag.X) manually` comment. Tags are added by the developer after reviewing the spec.

To override any auto-mapped value (component, author, tags), specify it explicitly in your prompt.

## Skill Usage

- **Always** check available skills before writing new code — invoke matching skills before manual exploration

## Key Architecture Rules

- **Always** `import { test } from "@fixtures/fixtures"` — never from `@playwright/test` in spec files
- **Always** use path aliases (`@api/*`, `@constants/*`, `@core/*`, `@enums/*`, `@fixtures/*`, `@pages/*`, `@base/*`, `@test-flows/*`, `@dtos/*`, etc.) — never relative cross-directory imports
- **Always** use `testDetails().withTags(...).withAuthor(...).apply()` on every `test()` and `test.describe()`
- **Always** include at least one `JiraComponent.*` in `.withTags()` — the corresponding Jira test case must have the matching Component set. Enforced by `yarn lint:jira-components` in CI
- **Always** prefix test names with `[ENG-{ticket}]`
- **Always** add `@step()` decorator to public methods in page, asserter, and steps files
- **Always** use `async/await` — `.then()` and `.catch()` are ESLint-restricted
- **Always** throw Error objects — `no-throw-literal` enforced
- **Formatting:** tabs (width 4), trailing commas everywhere (Prettier)
- **Unused vars:** prefix with `_` (pattern: `^_.`)
- **Object shorthand consistency:** never mix shorthand and non-shorthand properties in the same object literal — if any property uses `key: value` syntax, all properties must (including variables that match the key name, e.g. `houseEdge: houseEdge` not `houseEdge`)

## Playwright Config

| Setting               | Value                                                                     |
| --------------------- | ------------------------------------------------------------------------- |
| Test timeout          | 3 min                                                                     |
| Expect/Action timeout | 25s                                                                       |
| Navigation timeout    | 40s                                                                       |
| slowMo                | 300ms                                                                     |
| Viewport              | 1920x1080                                                                 |
| Retries               | 1 (CI) / 0 (local)                                                        |
| Workers               | 1 (CI) / auto (local)                                                     |
| Trace/Video           | retain-on-failure                                                         |
| Projects              | `chromium` (parallel) + `chromium-sequential-parallel` (parallel, `@sequential-parallel` tag) + `chromium-sequential` (serial, `@sequential` tag) |

## CI/CD

GitHub Actions on self-hosted runners: `playwright.yml` (nightly + manual, S3 reports, Slack, JIRA), `premerge.yml` (PR quality gates), `detect-modified-tests.yml` (runs modified specs ×3), `playwright-visual-images.yml` (visual regression).

## Tags

`@smoke` `@sequential` `@sequential-parallel` `@visual` `@originals` `@game-providers` `@admin-panel` `@chat` `@rewards` `@koth` `@free-spins` `@spins` `@v4` `@platform-bug` `@login` `@user-info` `@promo-codes` `@mines` `@plinko` `@keno` `@homepage`

## Known Patterns to Preserve

- **DB Pool Service**: Queries go through Express server (`services/db-pool-service/`), spawned in `global-setup.ts` — intentional for connection management across workers
- **`sessionAwarePage()`**: Page fixtures read from `browserSessionManager.active.page` — enables multi-user tests
- **`BrowserUserSession` Proxy lazy loading**: APIs/pages instantiated on demand via JS Proxies
- **`test.slow()` on game tests**: Non-deterministic loops (play until win/loss)
- **`test.fixme(isScheduledRun)`**: Some tests skipped in nightly but run manually
- **Global setup feature flags**: Features enabled before tests, cleaned up in teardown
- **`storageStateNewUserDB()`**: Creates real DB users per test (not mocked)
- **`withJiraBugTickets()` disables retries**: Auto-use fixture `_disableRetriesForBugTickets`

## Detailed Rules

Pattern-specific rules with code examples are in `.claude/rules/`:

- `pom-pattern.md` — Page Object Model four-file pattern and skeletons
- `test-structure.md` — Test file structure, tagging, parametrization
- `test-flows.md` — Test Flow Layer architecture and creation guide
- `test-data.md` — Test Data Management Layer (CSV, predefined, random, domain, factories)
- `fixtures.md` — Fixture system, scopes, auth, BrowserSessionManager
- `api-and-db.md` — API client and database patterns
- `anti-patterns.md` — What to avoid (project-specific)
- `base-asserter-methods.md` — BaseAsserter utility methods and raw `expect()` replacements
- `mcp-selectors.md` — playwright-cli selector authoring rules (Container→Content→Role methodology)

Additional documentation:

- `.claude/skills/mcp-selector-authoring.md` — playwright-cli inspection workflow (auth, snapshot, eval, selector methodology)
- `.claude/skills/playwright-cli/SKILL.md` — playwright-cli full command reference
