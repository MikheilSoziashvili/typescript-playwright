---
paths:
  - "tests/**/*.md"
---

# Xray Step Vocabulary — Phrase → Framework Call

When reading a scaffold `.md` file, use this table to translate manual test step language into framework code. This is the authoritative mapping used by `/xray-scaffold` (Step 4d) and `/implement-test` (Step 2c).

---

## Auth / Session

| Step text (case-insensitive) | Framework call | Notes |
|---|---|---|
| "login as (new) regular / standard / player user" | `loginAs(TestUserRole.REGULAR, { reuseContext: true })` | Single-session: authenticates existing context so injected fixture pages work |
| "login as regular user with [X] coins / balance" | `loginAs(TestUserRole.REGULAR, { reuseContext: true, regularUserOptions: { amount: X } })` | X in coins (1 USD ≈ 100 coins) |
| "login as regular user with [X] XP / rank [Y]" | `loginAs(TestUserRole.REGULAR, { reuseContext: true, regularUserOptions: { startingXp: X } })` | |
| "login as superadmin / super admin" | `loginAs(TestUserRole.SUPERADMIN, { reuseContext: true })` | |
| "login as user info admin" | `loginAs(TestUserRole.ADMIN_USER_INFO_ADMIN, { reuseContext: true })` | |
| "login as crypto admin" | `loginAs(TestUserRole.ADMIN_CRYPTOSUPADMIN, { reuseContext: true })` | |
| "login as promotions admin" | `loginAs(TestUserRole.ADMIN_PROMOTIONS_ADMIN, { reuseContext: true })` | |
| "login as sports / blog admin" | `loginAs(TestUserRole.ADMIN_SPORTS_BLOG_ADMIN, { reuseContext: true })` | |
| "login as streamer" | `loginAs(TestUserRole.REGULAR, { reuseContext: true, regularUserOptions: { tags: [UserTags.Streamer] } })` | |
| "login via steam" | Predefined user: `Configuration.steam.username` / `Configuration.steam.password` | Not a DB-created user |
| "User A" + "User B" in separate steps | Two `loginAs()` calls; name sessions `userASession` / `userBSession` | Multi-session: second `loginAs` has NO `reuseContext` |
| Admin steps + "regular user" steps together | Two sessions: admin first with `reuseContext: true`, user second without | Multi-session |
| "Login as X, then switch to Y later in same test" | Sequential switching: both calls with `reuseContext: true` | Same context, cookies cleared between logins |

**`reuseContext` rule — three patterns:**

| Pattern | Calls | Access |
|---|---|---|
| **Single user** | `loginAs(ROLE, { reuseContext: true })` | Fixture pages directly (`homePage`, etc.) |
| **Sequential switching** | Both calls with `reuseContext: true` | Fixture pages always reflect current active user |
| **Parallel multi-user** | First: `reuseContext: true`; second: no option | `session.pages.X` / `session.apis.X` / `session.getAuthenticatedUser()` |

Omitting `reuseContext: true` creates a **new** browser context — fixture pages remain unauthenticated. Only omit it intentionally for parallel multi-user tests (second session).

---

## Navigation

**Single-session** (use the injected fixture directly after `loginAs(..., { reuseContext: true })`):

| Step text | Fixture key | Navigate call |
|---|---|---|
| "home page" / "homepage" / "main page" | `homePage` | `await homePage.navigate()` |
| "wallet modal" / "open wallet" / "click wallet" | `walletModal` (via homePage) | `await homePage.clickWallet()` |
| "user info admin" / "UserInfoAdmin" | `userInfoAdminPage` | `await userInfoAdminPage.navigate()` |
| "crypto admin" / "CryptoAdmin" | `cryptoAdminPage` | `await cryptoAdminPage.navigate()` |
| "bulk actions admin" / "BulkActions" | `bulkActionsAdminPage` | `await bulkActionsAdminPage.navigate()` |
| "free spins admin" / "FreeSpinsAdmin" | `freeSpinsAdminPage` | `await freeSpinsAdminPage.navigate()` |
| "VIP manager admin" / "VipManager" | `vipManagerAdminPage` | `await vipManagerAdminPage.navigate()` |
| "promotions admin" / "PromotionAdmin" | `promotionsAdminPage` | `await promotionsAdminPage.navigate()` |
| "KOTH admin" / "KOTHAdmin" | `kothAdminPage` | `await kothAdminPage.navigate()` |
| "gift cards admin" | `giftCardsAdminPage` | `await giftCardsAdminPage.navigate()` |
| "KYC admin" | `kycAdminPage` | `await kycAdminPage.navigate()` |
| "rewards page" | `rewardsPage` | `await rewardsPage.navigate()` |
| "profile page" / "user profile" | `profilePage` | `await profilePage.navigate()` |
| "settings page" | `settingsPage` | `await settingsPage.navigate()` |
| "casino page" | `casinoPage` | `await casinoPage.navigate()` |
| "transactions page" | `transactionsPage` | `await transactionsPage.navigate()` |
| "KOTH page" | `kothPage` | `await kothPage.navigate()` |
| "promotions page" | `promotionsPage` | `await promotionsPage.navigate()` |
| "affiliates page" | `affiliatesPage` | `await affiliatesPage.navigate()` |
| "verification page" / "AML" | `verificationPage` | `await verificationPage.navigate()` |
| "dice game" | `diceGamePage` | `await diceGamePage.navigate()` |
| "crash game" | `crashGamePage` | `await crashGamePage.navigate()` |
| "plinko game" | `plinkoGamePage` | `await plinkoGamePage.navigate()` |
| "mines game" | `minesGamePage` | `await minesGamePage.navigate()` |
| "limbo game" | `limboGamePage` | `await limboGamePage.navigate()` |
| "hilo game" / "hi-lo" | `hiloGamePage` | `await hiloGamePage.navigate()` |
| "roulette game" | `rouletteGamePage` | `await rouletteGamePage.navigate()` |
| "blackjack game" | `blackjackGamePage` | `await blackjackGamePage.navigate()` |
| "keno game" | `kenoGamePage` | `await kenoGamePage.navigate()` |
| "pocket dice game" | `pocketDicePage` | `await pocketDicePage.navigate()` |

**Multi-session** (second session or when `reuseContext` is not used — access via the returned session object):
```ts
const session = await browserSessionManager.loginAs(TestUserRole.REGULAR);
await session.pages.casinoPage.navigate();
```

If a page is not in this table → check `pages/index.ts`. If not found there either → mark as **POM missing**.

---

## 2FA / TOTP

Any step that says "input 2FA code", "enter authenticator code", "confirm with 2FA" maps to this pattern.

**How 2FA works in the framework:**
- `generate2FACodeFromQRCodeImage(path)` — reads a QR code PNG saved during 2FA setup, extracts the TOTP secret, generates a valid code via `otplib`
- `generate2FACodeFromSecret(secret)` — generates code directly from a known secret string
- `twoFactorAuthModal` fixture — POM for the 2FA input modal

**Standard pattern (test must have 2FA enabled for the user):**

```typescript
// --- describe level ---
let qrCode2FAImagePath: string;

test.beforeEach(async ({ settingsPage }) => {
    qrCode2FAImagePath = createPngImagePath();
    await settingsPage.steps().navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
});

test.afterEach(async () => {
    await deleteFilesWithFilePaths([qrCode2FAImagePath]);
});

// --- inside test body, when 2FA modal appears ---
await twoFactorAuthModal.steps().generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
```

**Imports needed:**
```typescript
import { createPngImagePath, deleteFilesWithFilePaths } from "@core/utils/utils";
```

**Fixture:** `twoFactorAuthModal` — already registered, inject directly.

| Step text | Framework call |
|---|---|
| "input 2FA code" / "enter 2FA code" / "confirm with 2FA" | `await twoFactorAuthModal.steps().generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath)` |
| "input known 2FA secret directly" | `const code = await generate2FACodeFromSecret(secret); await twoFactorAuthModal.steps().enter2FaCodeSuccessfully(code)` |

---

## API-First Setup (these are NOT UI steps)

These step patterns represent infrastructure setup. Generate API/DB calls, NOT UI interactions:

| Step text | Framework call |
|---|---|
| "ban user [for reason X]" | `await api.banUser(targetUser.userId, BanReason.X, { Cookie: adminCookie })` |
| "hard ban / responsible gambling ban" | `BanReason.RESPONSIBLE_GAMING` |
| "hard ban / support requested ban" | `BanReason.SUPPORT_REQUESTED` |
| "enable feature [X] for [user type]" | `await api.setFeatureState(Feature.X, true, UserType.Y)` |
| "disable feature [X]" | `await api.setFeatureState(Feature.X, false, UserType.Y)` |
| "set balance to [X] [currency]" | `await gamdomApiDbFacade.upsertUserWalletsDb(userId, [Unit.X], amount)` |
| "place bet on [game]" | `await session.apis.{game}Api.placeBetUntilSuccessful(amount, param)` |
| "place bets until XP reaches [X]" | `await session.apis.{game}Api.placeBetUntilSuccessful(...)` in loop + XP check |
| "create/enable rain" | `await api.enableRain(request)` |
| "upload CSV / batch file" | `await page.handleFileUpload(locator, filePath)` |
| "run DB query / UPDATE ..." | `await gamdomDb.rawQuery(sql)` |
| "tip user" | `await api.tipUser(request)` |
| "create KOTH event" | `await api.createKothEvent(request)` |
| "wait for blockchain / wait for confirmation" | `await client.waitForCompletion(txId)` — flag: needs timeout strategy |

---

## Assertion Patterns

| Step text | Framework call |
|---|---|
| "[X] is displayed / visible / shown" | `await asserter.checkElementsAreVisible([map.X])` |
| "[X] is not displayed / hidden / removed" | `await asserter.checkElementsAreNotVisible([map.X])` |
| "[X] contains / shows text [Y]" | `await asserter.checkElementsContainText([{ locator: map.X, expectedText: "Y" }])` |
| "toast / notification shows [text]" | `await toast.assertThat().containsText("text")` |
| "balance increased by [formula]" | `const expected = ...; await asserter.verifyBalance(actual, expected)` |
| "balance decreased by [formula]" | `const expected = ...; await asserter.verifyBalance(actual, expected)` |
| "user is redirected to / on [page]" | `await expect(page.url()).toContain("/path")` |
| "button is enabled / clickable" | `await expect(map.button).toBeEnabled()` |
| "button is disabled / greyed out" | `await expect(map.button).toBeDisabled()` |
| "toast message 'Edit successful'" | `await toast.assertThat().containsText("Edit successful")` |
| "error message [text]" | `await asserter.checkElementsContainText([{ locator: map.errorMessage, expectedText: "text" }])` |
| "items displayed in order" | `await asserter.checkEachElementTextIsInSet([...], [...])` |

---

## Template Variables

| Syntax | Meaning | Code equivalent |
|---|---|---|
| `${param}` | Xray dataset column — value comes from CSV row | `record.param` |
| `{{value}}` | Literal expected UI value | `"value"` (string literal in assertion) |
| `{{formula}}` | Computed expected value | Evaluate formula → `const expected = ...` |

**Never swap these.** `${param}` always means CSV-driven. `{{value}}` always means a hardcoded expected string or number.

---

## Unresolvable — Flag and Continue

| Step pattern | Flag |
|---|---|
| "solve captcha if asked" | `// NOTE: captcha not automatable — skip or use test environment bypass` |
| "try again from step [N]" | `// NOTE: conditional retry loop — implement with while/retry logic` |
| "verify text is aligned / centered" | `// NOTE: layout assertion — consider visual regression test instead` |
| "wait for blockchain confirmation" | `// NOTE: async blockchain — needs client.waitForCompletion(txId) with timeout strategy` |
| "place any withdraw" | `// NOTE: amount/currency not specified — clarify with test author` |
| "place bets until XP reaches [X] with [game]" | `// NOTE: game not specified — clarify which game API to use` |

Do not block implementation on these. Generate the flag comment, continue with the rest of the test, and list them in the Step 7 report.

---

## For Manual Writers (QA team reference)

To help automation resolve your steps without back-and-forth, follow these conventions:

**Login steps — always specify:**
- Role: "regular user", "superadmin", "user info admin"
- Whether fresh: "new regular user" = auto-created; omit "new" only if using a predefined user
- Balance/state if relevant: "new regular user with 1,000 coins" or "new regular user at Royalty Up rank Gold"

**Navigation — use exact page names:**
Use the names from the navigation table above (e.g. "User Info Admin page", not "the admin").

**Setup preconditions — put in Xray Preconditions, not Steps:**
"User has 1M coins balance", "Feature flag X is enabled" → these are setup, not UI steps.

**Template variables:**
- `${param}` = dataset column (will become a CSV row value)
- `{{expectedValue}}` = literal UI text to assert (e.g. `{{Edit successful}}`)
- Never use `${x}` where you mean a fixed expected value

**Formulas — state explicitly in Expected Result:**
Write: "Balance increases by: `bet_amount × (multiplier − 1)`" so automation can compute it.
