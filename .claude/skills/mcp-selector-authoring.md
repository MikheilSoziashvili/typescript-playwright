---
paths:
  - "pages/**/*.ts"
  - "tests/**/*.spec.ts"
  - "fixtures/**/*.ts"
description: "Playwright MCP selector authoring using Container → Content → Role methodology"
---

# Playwright MCP — AI-Assisted Selector Authoring Skill
## ENG-16926 | Page Inspection, Selector Discovery & Test Authoring

---

## Role & Context

You are an AI automation engineer. You have access to **Playwright MCP** for live browser control and DOM inspection. Selector quality is driven by the **Container → Content → Role** methodology (from Verdex), enforced as rules and skills — no Verdex MCP server needed.

| Component | Purpose |
|---|---|
| **Playwright MCP** | Runtime browser control. JWT auth bypass, navigation, accessibility snapshots, DOM inspection via `browser_run_code`. |
| **Container → Content → Role** | Selector methodology applied to DOM data. Produces stable, scoped Playwright locators. |

---

## Step 0 — Authentication via Playwright MCP

### Two Auth Layers

Staging has **two independent auth layers**:

| Layer | What it does | How to bypass |
|---|---|---|
| **Google OAuth proxy** | Blocks all traffic to `staging-for-e2e-tests.teamgamdom.com` | Inject `Authorization: Bearer {OAUTH2_JWT}` header |
| **Gamdom app login** | The app itself requires a Gamdom account to see user-specific views | Log in via UI using predefined staging credentials |

### Layer 1 — Google OAuth Proxy Bypass (required for all MCP navigation)

**Step 1a** — Read the JWT from the project `.env` (via Bash, not in `browser_run_code`):

```bash
grep OAUTH2_JWT /Users/svetoslavlazarov/e2e/.env | cut -d'"' -f2
```

**Step 1b** — Inject the header and navigate in one `browser_run_code` call using an `async (page) => {}` function. This is the only format that supports `const`, `await`, and multi-statement logic:

```javascript
async (page) => {
    const jwt = 'PASTE_FULL_TOKEN_HERE';
    await page.context().setExtraHTTPHeaders({ Authorization: `Bearer ${jwt}` });
    await page.goto('{environment_url}{/path}', { waitUntil: 'domcontentloaded' });
    return page.url();
}
```

Replace `{environment_url}` with the value from Step 1c. The `async (page) => {}` wrapper is required — bare expressions and top-level `await` do NOT work in this tool.

**Step 1c** — Resolve the base URL from `configuration.ts` (never hardcode it):

```bash
grep "^ENVIRONMENT_URL" .env 2>/dev/null | cut -d'=' -f2 | tr -d '"' \
  || grep -oE '"https://[^"]+"' configuration.ts | head -1 | tr -d '"'
```

Then navigate via `browser_navigate` to `{environment_url}{/path}`.

**Step 1d — If you land on Google's sign-in page:** the header is now set on the context. Call `browser_navigate` again with the same staging URL — it will succeed on the second attempt. This happens because the OAuth proxy checks the header on the incoming request; the first navigation may be mid-redirect before the header takes effect.

After successful navigation you will be on the Gamdom site, **not yet logged in to the Gamdom application**.

---

### Layer 2 — Gamdom Application Login (only needed for logged-in user views)

If the test scenario requires a logged-in state (e.g., inspecting a user's favorites, wallet, profile), log in via the Gamdom UI:

1. Navigate to `{environment_url}` (resolve via `grep "^ENVIRONMENT_URL" .env 2>/dev/null | cut -d'=' -f2 | tr -d '"' \
  || grep -oE '"https://[^"]+"' configuration.ts | head -1 | tr -d '"'`, or `/login` if redirected)
2. Use the appropriate predefined staging account below
3. Password is `password` for **all** accounts

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
> **Do not create credential files** for these accounts — document them here only. Any `.env.accounts`, `*.credentials`, or `staging-logins.*` files must be gitignored (see `.gitignore`).

---

### Important Limitations

- `storageStateNewUserDB()` and `browserSessionManager.loginAs()` are **Playwright test runner internals** — they only work within the test execution context, NOT in the Playwright MCP browser session
- MCP inspection uses JWT proxy bypass — the Google OAuth proxy is bypassed regardless of which Gamdom account you're logged in as
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

## Step 1 — Page Exploration via Playwright MCP

Once authenticated, explore the target page entirely through MCP:

1. `browser_navigate(url)` — navigate to the page under test
2. `browser_snapshot()` — capture the full accessibility tree with stable ref IDs (`e1`, `e2`, ...)
3. Review the tree to identify all interactive elements the test will need (buttons, inputs, links, modals, etc.)
4. For deeper DOM inspection, use `browser_run_code` with `page.evaluate()` to:
   - Walk ancestor chains to find `data-testid` attributes
   - Analyze sibling structure for repeating patterns
   - Scan for headings, labels, and unique text content

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

When using these, annotate with `FALLBACK` + `TODO` comments.

---

## Priority Decision Tree

```
Goal: Write a locator for a page element
              │
              ▼
    [Playwright MCP] browser_navigate + browser_snapshot
    Identify element ref IDs from accessibility tree
              │
              ▼
    [browser_run_code] Walk ancestor chain for data-testid
              │
       Stable anchor found?
       ┌──────┴──────┐
      YES            NO
       │              │
       ▼              ▼
  Build locator  [browser_run_code] Analyze siblings + content
  using testid        │
  as container   Content anchor found? (text, alt, aria-label)
                 ┌────┴────┐
                YES        NO
                 │          │
                 ▼          ▼
            Build       Use CSS class or XPath as last resort
            locator     Add FALLBACK + TODO comments
            with content
            anchor (no comments on locator)
```

---

## Last-resort selectors

When no `data-testid` or semantic anchor exists within 5 ancestor levels, fall back to CSS class selectors — but add **no comments** to the locator. The locator should be self-explanatory.

---

## Token Efficiency Rules

- Never dump the full DOM — use `browser_snapshot()` first, then targeted `browser_run_code` queries
- Only call `browser_snapshot()` again if the page state has changed (navigation, modal open, etc.)
- Prefer `getByTestId` + `getByRole` chains over long attribute selectors

---

## MCP Configuration

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--caps=testing"]
    }
  }
}
```

---

## Integration with Project Framework

### Locator Placement

All locators go exclusively in `*-page-map.ts` files.
Page files contain actions, asserter files contain assertions, steps files contain action+assertion sequences.
See `pom-pattern.md` for the full four-file pattern.

### Session Management

- Playwright MCP runs its own browser session for exploration/inspection only
- Final locators are used with `BrowserSessionManager` via fixtures — not MCP sessions
- `storageStateNewUserDB()` / `storageStateNewSuperAdminUserDB()` are for `test.use()` in spec files, not for MCP auth

---

## References

- [Verdex MCP (methodology source)](https://github.com/verdexhq/verdex-mcp)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Why AI can't write good Playwright tests](https://dev.to/johnonline35/why-ai-cant-write-good-playwright-tests-and-how-to-fix-it-knn)
