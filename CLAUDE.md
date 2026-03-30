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
- **Use base-asserter methods** (`checkElementsAreVisible`, `checkElementsContainText`, etc.) over raw `expect()` in asserter classes
- **No `assert` prefix** on asserter methods — use `connectionsPageIsDisplayed()` not `assertConnectionsPageIsDisplayed()`
- **Steps class**: only for methods combining actions + assertions (e.g., navigate then verify)
- **Asserter class**: pure assertion methods (no actions)
- **Page class**: pure action methods (no assertions)

## MCP Page Inspection

- **Always ask which user type** before logging in to inspect a page: superadmin, default user1, or newly created DB user with specific tags
- Different users see different elements — never assume user type
- All predefined users are in `TestUserConfigurationObject` in `configuration.ts`

## New Test Creation

- **Always ask** which tags (`TestTag.*`) and which author (`JiraUser.*`) to use for `testDetails()`
- Never assume defaults — different tests need different tags and authors

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
| Projects              | `chromium` (parallel) + `chromium-sequential` (serial, `@sequential` tag) |

## CI/CD

GitHub Actions on self-hosted runners:

- `playwright.yml` — Main runner (nightly 3 AM + manual dispatch, 5-15 workers, S3 reports, Slack, JIRA)
- `premerge.yml` — PR quality gates (ESLint + Prettier + step decorator check, then runs modified tests)
- `detect-modified-tests.yml` — Git diff detection, runs new/modified specs with `--repeat-each=3`
- `playwright-visual-images.yml` — Visual regression image management

## Tags

`@smoke` `@sequential` `@visual` `@originals` `@game-providers` `@admin-panel` `@chat` `@rewards` `@koth` `@free-spins` `@spins` `@v4` `@platform-bug` `@login` `@user-info` `@promo-codes` `@mines` `@plinko` `@keno` `@homepage`

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
- `mcp-selectors.md` — MCP selector authoring rules (Container→Content→Role methodology)

Additional documentation:

- `.claude/skills/mcp-selector-authoring.md` — Dual MCP skill workflow (Verdex + Playwright MCP)
- `docs/dual-mcp-poc.md` — Dual MCP PoC documentation, auth strategies, and lessons learned
