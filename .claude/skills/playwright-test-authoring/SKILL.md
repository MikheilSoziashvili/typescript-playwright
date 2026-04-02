---
name: playwright-test-authoring
description: >
  Create Playwright E2E tests following the Gamdom 4-file POM pattern, fixture injection,
  @step decorators, testDetails metadata, and BrowserSessionManager multi-user sessions.
  Use when writing new tests, page objects, steps, asserters, or test flows.
argument-hint: "[page-name or test-description]"
---

# Playwright Test Authoring — Gamdom E2E Framework

You are writing tests for the Gamdom E2E automation framework. Follow every convention below exactly.

## Architecture Layers

```
Test Spec (.spec.ts)  → WHAT is being verified
  ↓
Test Flow Layer       → HOW a scenario is executed (business journeys)
  ↓
Page Objects (4-file) → HOW to interact with UI
  ↓
Playwright
```

## Critical Import Rule

```typescript
// ALWAYS this:
import { test } from "@fixtures/fixtures";

// NEVER this:
import { test } from "@playwright/test";
```

## Test Structure

Every test MUST have:

1. **`testDetails()` on both `test.describe` and `test()`**
2. **`[ENG-{ticket}]` prefix** on test name
3. **`.withAuthor(JiraUser.NAME)`** on every test
4. **`.withTags()`** with `JiraComponent` or `TestTag` values
5. **Arrange-Act-Assert** structure
6. **API-first preconditions** — use API/DB for setup, not UI clicks

```typescript
import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";

test.describe(
    "Feature area",
    testDetails().withTags(JiraComponent.ADMIN_PANEL).apply(),
    () => {
        test(
            "[ENG-XXXX] Test description",
            testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
            async ({ browserSessionManager }) => {
                // Arrange — API/DB setup
                const admin = await browserSessionManager.loginAs(
                    TestUserRole.SUPERADMIN,
                    { reuseContext: true },
                );
                const user = await browserSessionManager.loginAs(
                    TestUserRole.REGULAR,
                );

                // Act — UI interactions
                await user.pages.homePage.navigate();
                await user.pages.homePage.steps().performAction();

                // Assert — via assertThat()
                await user.pages.homePage.assertThat().expectedOutcome();
            },
        );
    },
);
```

## Session & Auth Pattern

**Always use `BrowserSessionManager`** for session creation and authentication. Do NOT use `test.use(storageState...)` — the project has moved away from that pattern. If a role isn't available in BrowserSessionManager, use `GamdomApiDbFacade`, `GamdomDb`, or `GamdomApi` directly to create users.

```typescript
// Admin session (reuseContext for efficiency when only doing API/admin work)
const adminSession = await browserSessionManager.loginAs(
    TestUserRole.SUPERADMIN,
    { reuseContext: true },
);

// Regular user session (separate browser context)
const regularUser = await browserSessionManager.loginAs(
    TestUserRole.REGULAR,
);

// Access session data
const targetUser = regularUser.getAuthenticatedUser().user;
const { username, password, userId } = targetUser;

// Access pages per session
await adminSession.pages.userInfoAdminPage.steps().navigateAndShowUserDetails(username);
await regularUser.pages.homePage.navigate();

// Access APIs per session — note the await on apis getter (lazy proxy)
const adminCookie = getCookieHeader(adminSession.getAuthenticatedUser().cookie);
const adminApi = await adminSession.apis.gamdomApi;
await adminApi.banUser(userId, BanReason.SUPPORT_REQUESTED, { Cookie: adminCookie });
```

**Available roles:** `ANONYMOUS`, `REGULAR`, `SUPERADMIN`, `ADMIN_USER_INFO_ADMIN`, `ADMIN_CRYPTOSUPADMIN`, `ADMIN_SPORTS_BLOG_ADMIN`, `ADMIN_PROMOTIONS_ADMIN`, `EV_REWARDS_SYSTEM_SUPERADMIN_WITH_USER_INFO`

## Available API Clients

API-first preconditions use these clients (all accessible via fixtures or session APIs):

| Client | Fixture | Purpose |
|--------|---------|---------|
| `GamdomApi` | `gamdomApi` | User auth, account mgmt, admin actions, feature flags, withdrawals |
| `GamdomCryptoApi` | `gamdomCryptoApi` | Hot wallet E2E config for crypto deposits/withdrawals |
| `CurrencyApi` | via session | Currency conversion rates and wallet balances |
| `CrashApi` | `crashApi` | Crash game bet placement |
| `DiceApi` | `diceApi` | Dice game bet placement |
| `HiloApi` | `hiloApi` | HiLo game bet placement |
| `RouletteApi` | `rouletteApi` | Roulette game bet placement |
| `PlinkoApi` | via `new PlinkoApi()` | Plinko game bet placement |
| `MailpitApi` | `mailpitApi` | Email inbox, message retrieval, link extraction |
| `VeriffApi` | `veriffApi` | KYC identity verification sessions |
| `CoinGeckoApi` | `coingeckoApi` | Cryptocurrency price data |

**Facades** (combine API + DB operations):
- `GamdomApiDbFacade` — `createSingleUserDbAndAuth()`, `createSuperAdminUserDbAndAuth()`, `createUserWithWalletsAndAuth()`, `upsertUserWalletsDb()`
- `GamdomApiFacade` — API-only user management

**Game APIs** all extend `GamesBaseApi` and share: `placeBet()`, `placeBetUntilSuccessful()`, `initGameSession()`. Reference: `api/games-api/`.

## Four-File POM Pattern

Every page object has 4 files with strict separation of concerns:

| File | Extends | Contains | Rule |
|------|---------|----------|------|
| `*-page-map.ts` | `BaseMap` | Locators as getters | **Locators ONLY here** |
| `*-page.ts` | `BasePage<Map>` | Actions, navigation, composition | Override `assertThat()` and `steps()` |
| `*-page-asserter.ts` | `BaseAsserter<Page>` | Assertions using `expect()` | **Assertions ONLY here** |
| `*-page-steps.ts` | `BasePageStep<Page>` | Multi-action business sequences | Orchestrates page + asserter |

### Map Skeleton

```typescript
import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class ExamplePageMap extends BaseMap {
    public constructor(page: Page) { super(page); }

    public get submitButton(): Locator {
        return this.page.getByTestId("submitButton");
    }
}
```

### Page Skeleton

```typescript
import { BasePage } from "@base/base-page";
import { ExamplePageMap } from "./example-page-map";
import { ExamplePageAsserter } from "./example-page-asserter";
import { ExamplePageSteps } from "./example-page-steps";
import { Page } from "@playwright/test";
import { step } from "decorators/step";

export class ExamplePage extends BasePage<ExamplePageMap> {
    public constructor(page: Page) { super(page, new ExamplePageMap(page)); }

    public override assertThat(): ExamplePageAsserter { return new ExamplePageAsserter(this); }
    public steps(): ExamplePageSteps { return new ExamplePageSteps(this); }

    @step()
    public async clickSubmit(): Promise<void> { await this.map.submitButton.click(); }
}
```

### Asserter Skeleton

```typescript
import { BaseAsserter } from "@base/base-asserter";
import { ExamplePage } from "./example-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";

export class ExamplePageAsserter extends BaseAsserter<ExamplePage> {
    public constructor(page: ExamplePage) { super(page); }

    @step()
    public async pageIsLoaded(): Promise<void> {
        await this.checkElementsAreVisible([this.gamdomPage.map.submitButton]);
    }
}
```

### Steps Skeleton

```typescript
import { BasePageStep } from "@pages/base/base-page-step";
import { ExamplePage } from "./example-page";
import { step } from "decorators/step";

export class ExamplePageSteps extends BasePageStep<ExamplePage> {
    public constructor(gamdomPage: ExamplePage) { super(gamdomPage); }

    @step()
    public async submitAndVerify(): Promise<void> {
        await this.gamdomPage.clickSubmit();
        await this.gamdomPage.assertThat().pageIsLoaded();
    }
}
```

### Mandatory Rules

- **`@step()` decorator** on ALL public methods in page, asserter, and steps files
- **Selector strategy**: `data-testid` > role-based > text filter > positional > XPath (last resort)
- **Path aliases**: Always use `@pages/*`, `@base/*`, `@fixtures/*`, `@api/*`, `@enums/*`, `@constants/*`, `@core/*`
- **async/await only**: No `.then()` or `.catch()` (ESLint-restricted)
- **Error objects only**: No throw literals
- **Tabs**: Use tabs for indentation (width 4), trailing commas everywhere

## Steps for Action + Assertion Sequences

Steps methods should combine **actions + assertions from the same POM** into a single reusable method. This keeps test specs concise and creates meaningful, named verification sequences. Actions can be navigation, clicks, form fills, or any page interaction — followed by one or more related assertions.

```typescript
// BAD — inline action + multiple assertions in spec
await user.pages.rewardsPage.navigate();
await user.pages.rewardsPage.assertThat().firstCheck();
await user.pages.rewardsPage.assertThat().secondCheck();

// GOOD — encapsulate in steps
await user.pages.rewardsPage.steps().navigateAndVerifyExpectedState();

// Also GOOD — click + assert in steps
await user.pages.walletModal.steps().openVaultAndVerifyBalance(expectedAmount);
```

When a test repeats action(s) + assertion(s) on the same page object, wrap them in a steps method. The method name should describe the combined intent (e.g., `navigateAndVerify...`, `submitAndConfirm...`, `openAndCheck...`).

## Test Modifiers

```typescript
test.slow();                          // 3x timeout — use for non-deterministic game loops
test.fixme(condition, "reason");      // Conditional skip
test.fixme(isScheduledRun);           // Skip in nightly, run manually
```

## Serial Execution

Use `test.describe.configure({ mode: "serial" })` AND tag with `TestTag.SEQUENTIAL`:

```typescript
test.describe("Serial tests", testDetails().withTags(TestTag.SEQUENTIAL).apply(), () => {
    test.describe.configure({ mode: "serial" });
    // tests...
});
```

## Parametrization (CSV)

```typescript
testData().fromCsvParsed({ file: CsvFilesName.SOME_FILE })
    .forEach((record) => {
        test(`[ENG-1234] Scenario - ${record.description}`,
            testDetails().withAuthor(JiraUser.NAME).apply(),
            async ({ somePage }) => { /* use record */ },
        );
    });
```

For detailed data source types (CSV, predefined, random, domain, factories), see `.claude/rules/test-data.md`.

## Test Flows

Use test flows for multi-page business journeys (NOT for single-page actions):

- Flows extend `BaseTestFlow` and use `@testFlow()` decorator
- Only **Scenario Flows** are exposed as test fixtures — Setup/Action/Verification flows are internal
- Flows receive `BrowserSessionManager` in constructor (never raw `page`)
- Never duplicate page object logic in flows — flows orchestrate, not re-implement

### When to use a Test Flow instead of inline spec code

**Use a test flow** when the test involves **multi-page orchestration with session switching, navigation across different pages, or complex setup + verification sequences**. Indicators:

- The test navigates to 3+ different pages/sections
- The test switches between user sessions (admin → regular user)
- The test performs API setup then multi-page UI verification
- The test body would exceed ~15-20 lines of orchestration logic

In these cases, extract the logic into a flow so the spec remains a single `await flow.execute()` call. Split the flow into focused `@testFlow()` methods (e.g., `banUser()`, `verifyRestrictedAccess()`) and compose them in an `execute()` method.

```typescript
// Test spec — clean and minimal
test("[ENG-XXXX] Complex scenario",
    testDetails().withAuthor(JiraUser.NAME).apply(),
    async ({ myScenarioFlow }) => {
        await myScenarioFlow.execute();
    },
);

// Flow — orchestrates multi-page journey
export class MyScenarioFlow extends BaseTestFlow {
    constructor(private readonly browserSessionManager: BrowserSessionManager) {
        super();
    }

    @testFlow("Setup: create and ban user")
    public async setup(): Promise<BrowserUserSession> {
        const admin = await this.browserSessionManager.loginAs(TestUserRole.SUPERADMIN, { reuseContext: true });
        // ... API setup
        return bannedUser;
    }

    @testFlow("Verify restricted access across pages")
    public async verifyAccess(user: BrowserUserSession): Promise<void> {
        await user.pages.homePage.navigate();
        await user.pages.homePage.assertThat().bannedBannerVisible();
        await user.pages.rewardsPage.steps().navigateAndVerify();
        // ... more page verifications
    }

    @testFlow("Execute full scenario")
    public async execute(): Promise<void> {
        const user = await this.setup();
        await this.verifyAccess(user);
    }
}
```

For detailed flow architecture, see `.claude/rules/test-flows.md`.

## Lifecycle Hooks

```typescript
test.beforeEach(async ({ page, gamdomApiDbFacade }) => { /* per-test setup */ });
test.afterEach(async ({ gamdomDb }) => { /* per-test cleanup */ });
test.beforeAll(async ({ gamdomApiDbFacade }) => { /* suite-level setup */ });
test.afterAll(async ({ gamdomApi }) => { /* suite-level cleanup */ });
```

## Fixture Registration

After creating a new page object, register it:

```typescript
// In the appropriate fixtures file (e.g., fixtures/gamdom-pages.ts)
yourPage: sessionAwarePage(YourPage),
```

## Before Writing Code

1. Search for existing page objects that cover the same page/component
2. Search for existing enums, constants, and test data that you can reuse
3. Check existing tests for similar patterns (especially in `tests/`)
4. Use API-first setup where possible (GamdomApi, GamdomApiDbFacade, games APIs)
5. Read base classes to understand inherited utilities before reinventing

## Reference Files

- Base classes: `pages/base/base-page.ts`, `base-map.ts`, `base-asserter.ts`, `base-page-step.ts`
- Fixtures: `fixtures/fixtures.ts` (merges 18 modules)
- Session management: `core/browser-session-mngmt.ts`
- API clients: `api/gamdom-api.ts`, `api/games-api/`, `api/currency-api.ts`, `api/mailpit-api.ts`
- Facades: `core/facades/gamdom-api-db/gamdom-api-db-facade.ts`
- Enums: `enums/` (TestTag, JiraComponent, JiraUser, BanReason, etc.)
- Constants: `constants/page-endpoints.ts`
- Gold-standard examples: `pages/home-page/` (all 4 files), `tests/ban-user.spec.ts`
- Detailed rules: `.claude/rules/` (test-data.md, test-flows.md, fixtures.md, api-and-db.md)
