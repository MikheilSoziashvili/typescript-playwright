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

### Auth Method

The staging environment uses a Google OAuth proxy requiring a JWT `Authorization` header. Authentication is done via JWT header injection:

1. `browser_run_code` → `page.context().setExtraHTTPHeaders({ Authorization: 'Bearer <OAUTH2_JWT>' })`
2. `browser_navigate` → opens any authenticated page directly

The `OAUTH2_JWT` token is read from the project's `.env` file.

### Important Limitations

- `storageStateNewUserDB()` and `browserSessionManager.loginAs()` are **Playwright test runner internals** — they only work within the test execution context, NOT in the Playwright MCP browser session
- MCP inspection always uses JWT bypass (superadmin-level access)
- The user type question is about **which page state to expect** (different roles see different elements), not which credentials to use

### User Selection (MUST ASK FIRST)

Before inspecting any page, **always ask the user** which user type's view they want to inspect:

- **superadmin** — full admin access, sees all elements including admin-only UI
- **default user** — standard user view, may have restricted elements
- **specific role/tags** — user with particular permissions; ask what the expected visible elements should be

This determines what elements you should expect to find on the page. Do NOT assume a user type.

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
            anchor
```

---

## FALLBACK Annotations

When no `data-testid` or semantic anchor exists within 5 ancestor levels:

```ts
// FALLBACK: no data-testid within 5 ancestors of telegram button
// TODO: Revisit with data-testid once Connections page components are refactored
public get connectTelegramButton(): Locator {
    return this.telegramSection.getByRole("button", {
        name: "Connect Telegram Account",
    });
}
```

`grep "FALLBACK:" pages/` surfaces all locators needing frontend `data-testid` improvements.

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
