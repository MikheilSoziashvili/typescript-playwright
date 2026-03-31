---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.setup.ts"
---

# Test File Structure & Conventions

## Required imports

```typescript
import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
```

Never import `test` from `@playwright/test` — always from `@fixtures/fixtures`.

## Test structure skeleton

**Single regular user** (`loginAs` with `reuseContext: true` — standard pattern):

```typescript
test.describe(
    "Feature area",
    testDetails()
        .withTags(JiraComponent.SOME_COMPONENT)
        .apply(),
    () => {
        test(
            "[ENG-1234] Test description",
            testDetails()
                .withTags(TestTag.SMOKE)
                .withAuthor(JiraUser.SOME_AUTHOR)
                .apply(),
            async ({ homePage, browserSessionManager }) => {
                await browserSessionManager.loginAs(TestUserRole.REGULAR, {
                    reuseContext: true,
                });
                await homePage.navigate();
                await homePage.steps().performAction();
                await homePage.assertThat().expectedOutcome();
            },
        );
    },
);
```

**Sequential user switching** (same tab, both with `reuseContext: true`):

```typescript
        async ({ profilePage, userInfoAdminPage, browserSessionManager }) => {
            await browserSessionManager.loginAs(TestUserRole.REGULAR, { reuseContext: true });
            await profilePage.navigate(); // fixture page authenticated as regular user

            // Switch to superadmin in the same tab (cookies cleared before re-login)
            await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, { reuseContext: true });
            await userInfoAdminPage.navigate(); // now authenticated as superadmin
        },
```

**Parallel multi-session** (two separate browser contexts, e.g. admin acts on a regular user):

```typescript
        async ({ browserSessionManager }) => {
            // First session reuses existing context; fixture pages are authenticated as admin
            const adminSession = await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
                reuseContext: true,
            });
            // Second session creates a fresh context — access pages via the returned session object
            const regularUser = await browserSessionManager.loginAs(TestUserRole.REGULAR);
            await adminSession.pages.userInfoAdminPage.steps().navigateAndShowUserDetails(
                regularUser.getAuthenticatedUser().user.username,
            );
            await regularUser.pages.homePage.navigate();
        },
```

**Never use `test.use(storageState*())` and `loginAs` in the same test** — they are mutually exclusive. Prefer `loginAs`.

## testDetails() builder — required on every test() and test.describe()

- `.withTags(...)` — `TestTag` and/or `JiraComponent` values. **Every test file must include at least one `JiraComponent.*`** (enforced by `yarn lint:jira-components` in CI). The corresponding Jira test case must have the matching Component set
- `.withAuthor(JiraUser.NAME)` — required, links to JIRA user
- `.withJiraBugTickets("ENG-123")` — known bugs (auto-disables retries)
- `.apply()` — returns Playwright TestDetails object

## Test naming

All test names must start with `[ENG-{ticket}]`:
```typescript
"[ENG-264] Place a single bet on Roulette and try to win"
```

## Auth patterns (choose one per test)

### 1. `browserSessionManager.loginAs()` — standard for all new tests

Three patterns — choose based on test needs:

| Pattern | When to use | `reuseContext` |
|---|---|---|
| Single user | One user, use fixture pages directly | `true` on the call |
| Sequential switching | Switch users in same tab mid-test | `true` on every call |
| Parallel multi-user | Two users active simultaneously | `true` on first, omit on second |

```typescript
// Single user
await browserSessionManager.loginAs(TestUserRole.REGULAR, { reuseContext: true });
// → fixture pages (homePage, casinoPage, etc.) are authenticated

// Sequential switching
await browserSessionManager.loginAs(TestUserRole.REGULAR, { reuseContext: true });
await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, { reuseContext: true });
// → each call clears cookies and re-authenticates in the same tab

// Parallel multi-user
const adminSession = await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, { reuseContext: true });
const regularUser = await browserSessionManager.loginAs(TestUserRole.REGULAR); // new context
await adminSession.pages.userInfoAdminPage.navigate();
await regularUser.pages.homePage.navigate();
// → use session.pages.X / session.apis.X / session.getAuthenticatedUser()
```

Available roles: `REGULAR`, `SUPERADMIN`, `ADMIN_USER_INFO_ADMIN`, `ADMIN_CRYPTOSUPADMIN`, `ADMIN_PROMOTIONS_ADMIN`, `ADMIN_SPORTS_BLOG_ADMIN`

`reuseContext: true` is required for single-session and sequential-switch tests so that injected fixture pages share the authenticated browser context. Omitting it creates a new, unauthenticated context — a common bug.

### 2. `gamdomApiDbFacade.create*AndAuth()` — programmatic user creation

Use when you need fine-grained user properties not covered by `loginAs` options, or when creating multiple users in `beforeEach` without logging them in via the browser.

```typescript
// Single user with custom properties → returns { user, cookie }
const { user, cookie } = await gamdomApiDbFacade.createSingleUserDbAndAuth({
    userClass: UserClasses.Admin,
    tags: UserTags.SuperAdmin,
    emailVerified: true,
    startingXp: 5000,
});
await setAuthenticationCookies(page, cookie);

// Superadmin shorthand
const { cookie } = await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
await setAuthenticationCookies(page, cookie);

// User with specific wallets/balance
const { cookie } = await gamdomApiDbFacade.createUserWithWalletsAndAuth({
    walletUnits: [Unit.BTC],
    amount: 1000000,
});
await setAuthenticationCookies(page, cookie);

// Multiple users (no auth — DB only, no cookies)
const [user1, user2] = await gamdomApiDbFacade.createUsersDb({ usersCount: 2 });

// Users with AML/KYC levels (DB only)
const [userData] = await gamdomApiDbFacade.createUsersWithAmlLevelsDb({
    users: [{ level: AmlVerificationLevel.FULL }],
});
```

### 3. Anonymous (no auth)

Simply omit `loginAs` — the test runs unauthenticated by default.

### Legacy — do NOT use in new tests

```typescript
// LEGACY — single-user, file-based storage state; no multi-user support
test.use(storageStateNewUserDB());
test.use(storageStateNewUserDB({ amount: 50000 }));
test.use(storageStateNewSuperAdminUserDB());
test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username));
test.use(storageStateUnauthenticatedUser());
// Also legacy: storageStateNewUserAPI, storageStateNewSuperAdminUserAPI,
//              storageStateUser1, storageStateSuperadmin, storageStateGoogleAuth
```

## Serial execution

Use `test.describe.configure({ mode: "serial" })` AND tag with `TestTag.SEQUENTIAL`:
```typescript
test.describe("Serial tests", testDetails().withTags(TestTag.SEQUENTIAL).apply(), () => {
    test.describe.configure({ mode: "serial" });
    // tests...
});
```

## CSV parametrization

```typescript
testData().fromCsvParsed({ file: CsvFilesName.SOME_FILE })
    .forEach((record) => {
        test(`[ENG-1234] Scenario - ${record.description}`,
            testDetails().withAuthor(JiraUser.NAME).apply(),
            async ({ somePage }) => { /* use record */ },
        );
    });
```

## Domain data parametrization

```typescript
const domainData = testData().fromDomain().vipManager;
domainData.batchUpdateScenarios.forEach(({ userCredentials }) => {
    test(`[ENG-2649] Verify for '${userCredentials.username}'`, ...);
});
```

## Lifecycle hooks

```typescript
test.beforeEach(async ({ page, gamdomApiDbFacade }) => { /* per-test setup */ });
test.afterEach(async ({ gamdomDb }) => { /* per-test cleanup */ });
test.beforeAll(async ({ gamdomApiDbFacade }) => { /* suite-level setup */ });
test.afterAll(async ({ gamdomApi }) => { /* suite-level cleanup */ });
```

## Test modifiers

- `test.slow()` — increases timeout (for non-deterministic game tests)
- `test.fixme(condition, "reason")` — conditional skip
- `test.fixme(isScheduledRun)` — skip in nightly runs

## Web-first assertions

Always use Playwright web-first assertions — they have built-in retry and wait logic. Never use `await locator.method()` inside a plain `expect()`:

```typescript
// ✅ Web-first — retries until visible or times out
await expect(page.getByText("success")).toBeVisible();

// ❌ Non-web-first — evaluates once, no retry, causes flakiness
expect(await page.getByText("success").isVisible()).toBe(true);
```

## Negative assertions

Prefer explicit zero-count over negated count assertions — negated counts allow false positives when more than one element exists:

```typescript
// ❌ Passes when count is 0 AND when count is 2+ — false positive
await expect(locator).not.toHaveCount(1);

// ✅ Only passes when count is exactly 0
await expect(locator).toHaveCount(0);
```

## { exact: true } for built-in locators

Use `{ exact: true }` when a built-in locator must match a specific text to avoid partial matches:

```typescript
// ❌ Matches both "Submit" and "Submit Form"
page.getByRole("button", { name: "Submit" });

// ✅ Matches only "Submit"
page.getByRole("button", { name: "Submit", exact: true });
```

## .toPass() and .poll() for non-immediate conditions

Use `.toPass()` when multiple assertions must all pass together (retries the whole block), or `expect.poll()` when a single condition needs polling. Use sparingly — overuse hides real bugs:

```typescript
// Multiple interdependent assertions — use .toPass()
await expect(async () => {
    const boxes = await map.betBoxes;
    expect(boxes).toHaveLength(bets.length);
}).toPass({ timeout: Timeout.SHORT, intervals: [300] });

// Single polling condition — use .poll()
await expect.poll(async () => map.someLocator.count(), { timeout: 5000 }).toBe(3);
```

## Locator isolation — avoid positional selectors

Always isolate locators by unique attributes or content. Positional selectors (`.first()`, `.nth(N)`, `.last()`) are a last resort — only use them when there is genuinely no unique attribute, text, or structural anchor to target.

```typescript
// ❌ Fragile — breaks if order changes, and unsafe in parallel tests
await expect(map.textInMessage.last()).toContainText(text);

// ✅ Prefer — isolate by the unique content the test controls
await expect(map.textInMessage.filter({ hasText: text })).toBeVisible();

// ✅ Prefer — isolate by data-testid or other unique attribute
await expect(map.messageContainer("some-id")).toBeVisible();
```

In parallel test runs, positional selectors on shared UI surfaces (chat, notification feeds, activity lists, leaderboards) are especially dangerous — another concurrent test may insert items before or after yours. Use a test-owned unique identifier (e.g. a random prefix from `predefinedRandom`) as the filter anchor instead.

## AI-Assisted Workflow

When implementing a test from a Jira/Xray ticket:
1. `/xray-scaffold ENG-XXXXX` — fetches steps from Xray, creates `tests/ENG-XXXXX-scaffold.md`
2. `/implement-test ENG-XXXXX` — reads the `.md`, checks for existing POMs, runs Playwright MCP inspection for any missing pages, creates POMs with real selectors, creates flows if needed, writes the spec
3. `/pr-review` — automated code review before opening PR
