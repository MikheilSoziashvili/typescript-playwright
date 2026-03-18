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

```typescript
test.describe(
    "Feature area",
    testDetails()
        .withTags(JiraComponent.SOME_COMPONENT)
        .apply(),
    () => {
        test.use(storageStateNewUserDB());

        test(
            "[ENG-1234] Test description",
            testDetails()
                .withTags(TestTag.SMOKE)
                .withAuthor(JiraUser.SOME_AUTHOR)
                .apply(),
            async ({ homePage, browserSessionManager }) => {
                // Arrange
                await browserSessionManager.loginAs(TestUserRole.REGULAR);
                // Act
                await homePage.navigate();
                await homePage.steps().performAction();
                // Assert
                await homePage.assertThat().expectedOutcome();
            },
        );
    },
);
```

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

## Auth configuration via test.use()

```typescript
test.use(storageStateNewUserDB());                              // New user
test.use(storageStateNewUserDB({ amount: 50000 }));             // With balance
test.use(storageStateNewSuperAdminUserDB());                    // Super admin
test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username)); // Existing user
test.use(storageStateUnauthenticatedUser());                    // No auth
```

## Multi-user tests via BrowserSessionManager

```typescript
const superAdmin = await browserSessionManager.loginAs(TestUserRole.SUPERADMIN);
await browserSessionManager.loginAs(TestUserRole.REGULAR, { reuseContext: true });
// Session-scoped access:
await superAdmin.apis.gamdomApi;
superAdmin.pages.homePage;
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
