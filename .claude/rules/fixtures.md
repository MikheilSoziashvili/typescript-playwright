---
paths:
  - "fixtures/**/*.ts"
---

# Fixture System

All fixtures merge via `mergeTests()` in `fixtures/fixtures.ts`. 18 modules total.

## Scopes

- **Test scope (default):** Page objects, components, modals, handlers, listeners, flows
- **Worker scope:** API clients, database, facades, test data, crypto clients

## Page fixture pattern

Uses `sessionAwarePage()` to read from `browserSessionManager.active.page`:
```typescript
homePage: sessionAwarePage(HomePage),
```

## Auto-use fixtures (run on every test)

- `_reportPortalTest` — ReportPortal setup
- `_disableRetriesForBugTickets` — Skips retries for tests with `withJiraBugTickets()`

## Authentication

### `browserSessionManager.loginAs()` — standard for all new tests

Three distinct context patterns — pick the right one:

**Pattern 1: Single user (`reuseContext: true`)**

One user, one browser tab. Fixture pages (e.g. `homePage`) are automatically authenticated:

```typescript
await browserSessionManager.loginAs(TestUserRole.REGULAR, { reuseContext: true });
await homePage.navigate(); // fixture page is already authenticated
```

Without `reuseContext: true`, `loginAs` creates a **new** browser context, leaving fixture pages unauthenticated — a common mistake.

**Pattern 2: Sequential user switching (both calls with `reuseContext: true`)**

Switch users within the same tab. Cookies are cleared before each re-login. Fixture pages always reflect the currently active user:

```typescript
await browserSessionManager.loginAs(TestUserRole.REGULAR, { reuseContext: true });
await profilePage.navigate(); // logged in as regular user

await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, { reuseContext: true });
await userInfoAdminPage.navigate(); // now logged in as superadmin, same tab
```

**Pattern 3: Parallel multi-user (first with `reuseContext`, second without)**

Two separate browser contexts live simultaneously. Access each session via the returned object to avoid collision:

```typescript
const adminSession = await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, { reuseContext: true });
const regularUser = await browserSessionManager.loginAs(TestUserRole.REGULAR); // fresh context

await adminSession.pages.userInfoAdminPage.steps().navigateAndShowUserDetails(username);
await regularUser.pages.homePage.navigate();
```

### `loginAs` options

```typescript
// With balance or user properties
await browserSessionManager.loginAs(TestUserRole.REGULAR, {
    reuseContext: true,
    regularUserOptions: { amount: 50000 },
});

// With XP / rank
await browserSessionManager.loginAs(TestUserRole.REGULAR, {
    reuseContext: true,
    regularUserOptions: { startingXp: 5000 },
});

// With tags (e.g. streamer)
await browserSessionManager.loginAs(TestUserRole.REGULAR, {
    reuseContext: true,
    regularUserOptions: { tags: [UserTags.Streamer] },
});

// With specific wallet units and balance
await browserSessionManager.loginAs(TestUserRole.REGULAR, {
    reuseContext: true,
    regularUserWalletOptions: { walletUnits: [Unit.BTC], amount: 1000000 },
});

// Superadmin / other admin roles
await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, { reuseContext: true });
// Also: ADMIN_USER_INFO_ADMIN, ADMIN_CRYPTOSUPADMIN, ADMIN_PROMOTIONS_ADMIN, ADMIN_SPORTS_BLOG_ADMIN

// With proxy credentials (creates a new context regardless of reuseContext)
await browserSessionManager.loginAs(TestUserRole.ADMIN_USER_INFO_ADMIN, {
    proxyCredentials: { server: "http://proxy:8080", username: "u", password: "p" },
});
```

### Session object API (returned by `loginAs`)

```typescript
const session = await browserSessionManager.loginAs(TestUserRole.REGULAR);

// Access page objects scoped to this session (lazy-loaded via Proxy)
await session.pages.homePage.navigate();
await session.pages.userInfoAdminPage.steps().navigateAndShowUserDetails(username);

// Access API clients scoped to this session (no manual cookie passing needed)
await (await session.apis.gamdomApi).banUser(userId, BanReason.X, { Cookie: cookieHeader });

// Get authenticated user details
const { user, cookie } = session.getAuthenticatedUser();
const { username, password, userId } = session.getAuthenticatedUser().user;
const cookieHeader = getCookieHeader(session.getAuthenticatedUser().cookie);

// Balance handler (lazy-loaded)
const handler = await session.userBalanceHandler();
const balance = await handler.walletBalanceInCoins(unit, WalletType.DEFAULT);
```

### `gamdomApiDbFacade.create*()` — programmatic user creation

Use when `loginAs` options don't cover the required user state, or when creating multiple users without browser login.

```typescript
// Single user → returns { user, cookie }
const { user, cookie } = await gamdomApiDbFacade.createSingleUserDbAndAuth();
await setAuthenticationCookies(page, cookie);

// With options
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

// Multiple users (DB only, no cookies)
const [user1, user2] = await gamdomApiDbFacade.createUsersDb({ usersCount: 2 });

// Users with AML/KYC levels (DB only)
const [userData] = await gamdomApiDbFacade.createUsersWithAmlLevelsDb({
    users: [{ level: AmlVerificationLevel.FULL }],
});
```

### Anonymous (no auth)

Omit `loginAs` entirely — the test runs unauthenticated by default.

### Legacy `storageState*` — do NOT use in new tests

> **LEGACY.** All `storageState*` fixture functions use Playwright's `test.use({ storageState })` pattern — single-user, file-based, no multi-user support. 25+ spec files still use them; do not add new usage.

```typescript
// LEGACY — do not use
test.use(storageStateNewUserDB());               // 25 spec files
test.use(storageStateNewSuperAdminUserDB());      // 15 spec files
test.use(storageStateUserAPI(username));          // 4 spec files
// Defined but unused: storageStateNewUserAPI, storageStateNewSuperAdminUserAPI,
//                     storageStateUser1, storageStateSuperadmin,
//                     storageStateGoogleAuth, storageStateUnauthenticatedUser
```

## Creating a new fixture

1. Add to existing fixture file matching the category, or create new module
2. Use `base.extend<YourType>({ fixtureName: async ({ deps }, use) => { ... } })` pattern
3. Worker-scoped for stateless services (APIs, DB), test-scoped for stateful (pages)
4. If new module, add to `mergeTests()` in `fixtures/fixtures.ts`

## Fixture categories

| File | Contents |
|------|----------|
| `gamdom-pages.ts` | User-facing page objects via `sessionAwarePage()` |
| `admin-pages-fixtures.ts` | Admin panel pages |
| `game-pages-fixtures.ts` | Game-specific pages |
| `external-pages-fixtures.ts` | External integrations (Steam, Google) |
| `components-fixtures.ts` | Toast, header, footer, chat, datepicker |
| `modal-fixtures.ts` | Wallet, login, register modals |
| `api-fixtures.ts` | GamdomApi, GamdomCryptoApi, MailpitApi, etc. |
| `auth-fixtures.ts` | Storage state factory functions |
| `test-data-fixtures.ts` | testData sources (predefined, random, domain, object) |
| `db-fixtures.ts` | GamdomDb instance |
| `test-flows-fixtures.ts` | Business journey flow instances |
| `handlers-fixtures.ts` | UserBalanceHandler |
| `listeners-fixtures.ts` | Console/network event listeners |
| `crypto-fixtures.ts` | Fireblocks, UTXO, XRP client adapters |
| `facade-fixtures.ts` | GamdomApiDbFacade, GamdomApiFacade |
| `reportportal-fixtures.ts` | ReportPortal auto-use setup |
| `retry-fixtures.ts` | Bug ticket retry disabling (auto-use) |
| `visual-automation-fixtures.ts` | Visual testing helpers |
