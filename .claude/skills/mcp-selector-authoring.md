---
paths:
  - "pages/**/*.ts"
  - "tests/**/*.spec.ts"
  - "fixtures/**/*.ts"
description: "playwright-cli selector authoring using Container → Content → Role methodology"
---

# playwright-cli — AI-Assisted Selector Authoring Skill
## ENG-16926 | Page Inspection, Selector Discovery & Test Authoring

---

## Role & Context

You are an AI automation engineer. You have access to **playwright-cli** for live browser control and DOM inspection. Selector quality is driven by the **Container → Content → Role** methodology (from Verdex), enforced as rules and skills.

| Component | Purpose |
|---|---|
| **playwright-cli** | Runtime browser control. JWT auth bypass, navigation, token-efficient snapshots, targeted DOM inspection via `eval` and `run-code`. |
| **Container → Content → Role** | Selector methodology applied to DOM data. Produces stable, scoped Playwright locators. |

Use a named session (`-s=staging`) across all commands so auth state and navigation persist within an inspection session.

---

## Step 0 — Authentication via playwright-cli

### Two Auth Layers

Staging has **two independent auth layers**:

| Layer | What it does | How to bypass |
|---|---|---|
| **Google OAuth proxy** | Blocks all traffic to `staging-for-e2e-tests.teamgamdom.com` | Inject `Authorization: Bearer {OAUTH2_JWT}` header |
| **Gamdom app login** | The app itself requires a Gamdom account to see user-specific views | Log in via UI using predefined staging credentials |

### Layer 1 — Google OAuth Proxy Bypass

**Step 1a** — Read the JWT from the project `.env`:

```bash
grep OAUTH2_JWT /Users/svetoslavlazarov/e2e/.env | cut -d'"' -f2
```

**Step 1b** — Open a named session, inject the header, and navigate in one `run-code` call:

```bash
playwright-cli -s=staging open --headed
playwright-cli -s=staging run-code "async page => { const jwt = 'PASTE_FULL_TOKEN_HERE'; await page.context().setExtraHTTPHeaders({ Authorization: \`Bearer \${jwt}\` }); await page.goto('{environment_url}{/path}', { waitUntil: 'domcontentloaded' }); }"
```

**Step 1c** — Resolve the base URL from `configuration.ts` (never hardcode it):

```bash
grep "^ENVIRONMENT_URL" .env 2>/dev/null | cut -d'=' -f2 | tr -d '"' \
  || grep -oE '"https://[^"]+"' configuration.ts | head -1 | tr -d '"'
```

**Step 1d — If you land on Google's sign-in page:** the header is now set on the context. Run `playwright-cli -s=staging goto {environment_url}{/path}` again — it will succeed on the second attempt.

After successful navigation you will be on the Gamdom site, **not yet logged in to the Gamdom application**.

---

### Layer 2 — Gamdom Application Login (only needed for logged-in user views)

If the test scenario requires a logged-in state, log in via the Gamdom UI using the exact sequence below. The login is a modal — **do not use generic selectors** like `button:has-text("Sign in")` as the page has multiple sign-in buttons and the modal overlay intercepts clicks on background elements.

```bash
# 1. Click the Sign In button in the navbar and wait for the auth modal to appear
playwright-cli -s=staging run-code "async page => { await page.getByTestId('signin-nav').click(); await page.locator('input[name=username]').waitFor({ state: 'visible' }); }"

# 2. Fill credentials and submit — wait for the modal to close (proves login succeeded)
playwright-cli -s=staging run-code "async page => { await page.locator('input[name=username]').fill('{username}'); await page.locator('input[name=password]').fill('password'); await page.getByTestId('start-playing-login').click(); await page.getByTestId('start-playing-login').waitFor({ state: 'hidden', timeout: 10000 }); return page.url(); }"
```

**Key testids for the auth modal:**
- `signin-nav` — navbar sign-in button (opens the modal)
- `start-playing-login` — modal submit button (logs in)
- `signup-nav` — navbar create account button
- `closeButton` — modal close button
- `steamSignInButton` / `googleSignInButton` / `telegramSignInButton` — social login buttons

Replace `{username}` with the appropriate account from the table below. Password is `password` for **all** accounts.

#### Predefined Staging Accounts

| Username | Role / Tags | Use when |
|---|---|---|
| `superadmin` | SuperAdmin tag | Admin-only pages, full access |
| `superadmin1`–`superadmin5` | SuperAdmin tag | Additional superadmin sessions |
| `supportadmin` | SupportStaff tag | Support staff views |
| `marketingadmin` | MarketingStaff tag | Marketing staff views |
| `vipadmin` | VIPStaff tag | VIP staff views |
| `socialadmin` | SocialMediaStaff tag | Social media staff views |
| `moderator1` | Basic moderator | Moderator views |
| `moderator2` | Basic moderator (not email verified) | Unverified moderator views |
| `streamer1` | Streamer + StreamerVIP tags; aff code `streamer1` (WAGERED share) | Streamer-specific UI |
| `streamer2` | Streamer tag only; aff code `streamer2` (REVENUE share), marketing tag `marketing2` | Streamer without VIP |
| `user1` | Basic user, lvl1, affiliated with `streamer1` | Regular logged-in user |
| `user2` | Basic user, lvl2, affiliated with `streamer1` | Levelled-up user |
| `user3` | Basic user, lvl1, affiliated with `streamer2` | Different affiliation |
| `user4` | Basic user, lvl2, marketing tag `marketing1` | Marketing-tagged user |
| `user5` | Basic user, not affiliated, not email verified | Unverified user |

> **Password for all accounts:** `password`
> **Do not create credential files** for these accounts — document them here only.

---

### Important Limitations

- `storageStateNewUserDB()` and `browserSessionManager.loginAs()` are **Playwright test runner internals** — they only work within the test execution context, NOT in the playwright-cli browser session
- playwright-cli inspection uses JWT proxy bypass — the Google OAuth proxy is bypassed regardless of which Gamdom account you're logged in as
- The user type question (below) is about **which Gamdom account state to set up**, not which proxy credentials to use

### User Selection (MUST ASK FIRST)

Before inspecting any page, **always ask the user** which view to inspect:

- **superadmin** — log in as `superadmin` / `superadmin1`–`superadmin5`; full admin access
- **regular user** — log in as `user1`–`user4`; standard user view
- **streamer** — log in as `streamer1` or `streamer2`; streamer-specific elements
- **not logged in** — skip Gamdom login; only public-facing elements visible
- **specific role** — use the table above to pick the right account

This determines which elements will be visible during snapshot inspection. Do NOT assume a user type.

---

## Step 1 — Page Exploration via playwright-cli

Once authenticated, explore the target page using token-efficient commands:

1. `playwright-cli -s=staging goto {url}` — navigate to the page under test
2. `playwright-cli -s=staging snapshot --depth=4` — capture a shallow accessibility tree (sufficient for most pages); increase depth only if needed
3. Review the tree to identify all interactive elements the test will need (buttons, inputs, links, modals, etc.)
4. For deeper DOM inspection, use targeted `eval` queries to:
   - Walk ancestor chains to find `data-testid` attributes
   - Analyze sibling structure for repeating patterns
   - Scan for headings, labels, and unique text content

```bash
# Walk ancestor chain from a specific element ref
playwright-cli -s=staging eval "el => { let e = el; while (e) { if (e.dataset?.testid) return e.dataset.testid; e = e.parentElement; } return null; }" e42

# Get element's full ancestor testid chain
playwright-cli -s=staging eval "el => { const ids = []; let e = el; while (e) { if (e.dataset?.testid) ids.push(e.dataset.testid); e = e.parentElement; } return ids; }" e42

# Inspect a container's children structure
playwright-cli -s=staging eval "el => Array.from(el.querySelectorAll('[data-testid]')).map(n => n.dataset.testid)" e15

# Snapshot a specific element subtree
playwright-cli -s=staging snapshot e15
```

**Token efficiency:** Start with `--depth=4`. Only call `snapshot` again after navigation or modal opens. Use `eval` for targeted queries instead of re-snapshotting the whole page.

---

## Step 2 — Build Selectors Using Container → Content → Role

For every element identified in Step 1, follow this methodology:

### Three Steps

1. **Container** — Find the nearest ancestor with `data-testid` or stable semantic anchor
2. **Content** — Use text, images, or attributes to disambiguate among siblings
3. **Role** — Target the interactive element by its accessibility role and name

### Composite Pattern

```ts
page.getByTestId('container-id')
  .filter({ hasText: 'unique label or text' })
  .getByRole('button', { name: 'Submit' })
```

### Locator Inheritance Rule

Locators in `*-page-map.ts` files MUST use getter chaining — child locators inherit from their parent container getter, not from `this.page` directly:

```ts
// Container getter
public get telegramSection(): Locator {
    return this.page.getByTestId("page-container")
        .locator("div", { has: this.page.locator("img[alt='telegram']") });
}

// Child inherits from container — NOT from this.page
public get connectTelegramButton(): Locator {
    return this.telegramSection.getByRole("button", {
        name: "Connect Telegram Account",
    });
}

// Another child inheriting from the same container
public get telegramDescription(): Locator {
    return this.telegramSection.locator("p", {
        hasText: "Connect your Telegram account",
    });
}
```

This ensures every locator is scoped to its container, making them resilient to DOM changes outside the container.

### Selector Priority

| Priority | Selector Type | Example |
|---|---|---|
| 1 (highest) | `getByTestId` | `page.getByTestId("submit-btn")` |
| 2 | `getByRole` + name | `page.getByRole("button", { name: "Submit" })` |
| 3 | Content filters | `.filter({ hasText: "..." })` / `.locator("div", { has: ... })` |
| 4 | Attribute anchors | `img[alt='telegram']`, `[data-type='...']` |
| 5 (lowest) | CSS classes / XPath | `[class*='StyledComponent']`, `//ancestor::div` — last resort only |

### Prohibited Selectors

| Pattern | Why |
|---|---|
| `.nth()`, `.first()`, `.last()` | Index-dependent, breaks on DOM reorder |
| Bare `page.locator("button")` | Too broad without container scoping |

### Low Priority (last resort only)

| Pattern | When acceptable |
|---|---|
| Raw CSS classes (`[class*='StyledComponent-sc-']`) | Build-hashed, unstable — but sometimes the only option |
| XPath ancestor traversal (`//ancestor::div[contains(@class,...)]`) | Fragile — but acceptable when no other anchor exists |

Do **not** add comments to these locators — no FALLBACK, TODO, or other annotations.

---

## Priority Decision Tree

```
Goal: Write a locator for a page element
              │
              ▼
    [playwright-cli] goto + snapshot --depth=4
    Identify element ref IDs from accessibility tree
              │
              ▼
    [playwright-cli eval] Walk ancestor chain for data-testid
              │
       Stable anchor found?
       ┌──────┴──────┐
      YES            NO
       │              │
       ▼              ▼
  Build locator  [playwright-cli eval] Analyze siblings + content
  using testid        │
  as container   Content anchor found? (text, alt, aria-label)
                 ┌────┴────┐
                YES        NO
                 │          │
                 ▼          ▼
            Build       Use CSS class or XPath as last resort
            locator     No comments on locators
            with content
            anchor (no comments on locator)
```

---

## Last-resort selectors

When no `data-testid` or semantic anchor exists within 5 ancestor levels, fall back to CSS class selectors — but add **no comments** to the locator. The locator should be self-explanatory.

---

## playwright-cli Navigation Best Practices

- **Discover testids first, act second:** Before clicking anything, run `eval` to list all buttons/links with their `data-testid` in the target area. This prevents clicking the wrong element when duplicates exist (e.g. multiple "Sign in" buttons on a page).
  ```bash
  playwright-cli -s=staging eval "() => { const btns = document.querySelectorAll('button, [role=button]'); return Array.from(btns).map(b => ({ text: b.textContent?.trim()?.slice(0, 40), testid: b.dataset?.testid })).filter(b => b.text); }"
  ```
- **Modals intercept clicks:** When a modal/overlay is open, background elements are blocked. Always target elements **inside the modal** using `[role=presentation]` or the modal's container as scope.
- **Always use `getByTestId` for actions:** Prefer `page.getByTestId('start-playing-login').click()` over `page.locator('button:has-text("Sign in")').click()`. Text-based selectors match multiple elements and cause interception errors.
- **Smart waits over hardcoded timeouts:** Never use `waitForTimeout()`. Use Playwright's built-in smart waits via `run-code`:
  ```bash
  # Wait for an element that proves the page is ready
  playwright-cli -s=staging run-code "async page => { await page.locator('[data-testid=signin-nav]').waitFor({ state: 'visible' }); }"
  # Wait for a loading indicator to disappear
  playwright-cli -s=staging run-code "async page => { await page.locator('.loading').waitFor({ state: 'hidden' }); }"
  # Wait for URL change after navigation
  playwright-cli -s=staging run-code "async page => { await page.waitForURL('**/casino'); }"
  ```
  **Do NOT use `waitForLoadState('networkidle')`** — Gamdom uses WebSockets and background APIs that keep the network busy, making networkidle unreliable (same reason it's banned in our test anti-patterns).
- **Avoid `/login` path:** Gamdom has no `/login` route — it redirects to 404. Login is always via the modal triggered by `signin-nav`.

## Token Efficiency Rules

- Start with `snapshot --depth=4` — shallow first, deep only when needed
- Use `snapshot {ref}` to zoom into a specific subtree rather than re-snapshotting the whole page
- Use `eval` for targeted DOM queries instead of repeated full snapshots
- Only call `goto` + `snapshot` again if the page state has changed (navigation, modal open, etc.)
- Prefer `getByTestId` + `getByRole` chains over long attribute selectors

---

## Integration with Project Framework

### Locator Placement

All locators go exclusively in `*-page-map.ts` files.
Page files contain actions, asserter files contain assertions, steps files contain action+assertion sequences.
See `pom-pattern.md` for the full four-file pattern.

### Session Management

- playwright-cli runs its own named browser session (`-s=staging`) for exploration/inspection only
- Final locators are used with `BrowserSessionManager` via fixtures — not the playwright-cli session
- `storageStateNewUserDB()` / `storageStateNewSuperAdminUserDB()` are for `test.use()` in spec files, not for playwright-cli auth

---

## References

- [playwright-cli](https://github.com/microsoft/playwright-cli)
- [Verdex (Container->Content->Role methodology source)](https://github.com/verdexhq/verdex-mcp)
- [Why AI can't write good Playwright tests](https://dev.to/johnonline35/why-ai-cant-write-good-playwright-tests-and-how-to-fix-it-knn)
