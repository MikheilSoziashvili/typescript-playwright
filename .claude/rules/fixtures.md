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

## Authentication — `browserSessionManager.loginAs()` (default)

**Always use `browserSessionManager.loginAs()`** for authenticated tests. When a test requires a logged-in user, always ask which user type (regular, superadmin, etc.) before implementing.

```typescript
// Regular user (default)
const user = await browserSessionManager.loginAs(TestUserRole.REGULAR, {
    reuseContext: true,
});
await user.pages.homePage.navigate();

// Regular user with balance
const user = await browserSessionManager.loginAs(TestUserRole.REGULAR, {
    reuseContext: true,
    regularUserOptions: { amount: LOW_USER_AMOUNT },
});

// Superadmin
const superAdmin = await browserSessionManager.loginAs(TestUserRole.SUPERADMIN);

// Session-scoped access (lazy via Proxy)
await superAdmin.apis.gamdomApi;
superAdmin.pages.homePage;
await superAdmin.userBalanceHandler();
```

## Legacy: `storageStateNewUserDB()` / `test.use()`

> **LEGACY — do not use unless explicitly requested.** These factory functions are outdated. Always prefer `browserSessionManager.loginAs()` instead.

```typescript
// LEGACY — only use when explicitly asked
test.use(storageStateNewUserDB());
test.use(storageStateNewUserDB({ amount: 50000 }));
test.use(storageStateNewSuperAdminUserDB());
test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username));
test.use(storageStateUnauthenticatedUser());
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
| `api-fixtures.ts` | GamdomApi, GamdomCryptoApi, MailinatorApi, etc. |
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
