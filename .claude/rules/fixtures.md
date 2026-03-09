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

## Auth storage state fixtures

Factory functions returning Playwright Fixtures:
```typescript
test.use(storageStateNewUserDB());                              // New user via DB
test.use(storageStateNewUserDB({ amount: 50000 }));             // With balance
test.use(storageStateNewUserDB({ userClass: UserClasses.Admin, tags: [UserTags.SuperAdmin] }));
test.use(storageStateNewSuperAdminUserDB());                    // Super admin shorthand
test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username)); // Existing user via API
test.use(storageStateUnauthenticatedUser());                    // No auth
```

## BrowserSessionManager

Manages multiple concurrent user sessions in a single test:
```typescript
// Switch/create sessions by role
const superAdmin = await browserSessionManager.loginAs(TestUserRole.SUPERADMIN);
await browserSessionManager.loginAs(TestUserRole.REGULAR, { reuseContext: true });

// Session-scoped access (lazy via Proxy)
await superAdmin.apis.gamdomApi;
superAdmin.pages.homePage;
await superAdmin.userBalanceHandler();
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
