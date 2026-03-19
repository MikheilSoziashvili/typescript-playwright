---
paths:
    - "pages/**/*-page-map.ts"
---

# MCP-Assisted Selector Authoring Rules

When generating or modifying locators in `*-page-map.ts` files:

## Required: Container → Content → Role

Every locator MUST follow this three-layer scoping hierarchy:

1. **Container** — Find a stable ancestor anchor using `resolve_container(ref)`. Prefer `data-testid`, then semantic landmarks (`role`, `<section>`, `<nav>`), then unique `data-*` attributes.
2. **Content** — Disambiguate among siblings using `.filter({ hasText: "unique text" })`, `.locator("tag", { has: page.locator("img[alt='...']") })`, or other content-based filters. Use `inspect_pattern(ref, level)` to analyze sibling structure when needed.
3. **Role** — Target the interactive element by accessibility role: `.getByRole("button", { name: "Action" })`. Use `extract_anchors(ref, depth)` to discover headings, labels, and unique text for the `name` parameter.

Not every locator needs all three layers — skip Content if the Container + Role combination is already unique.

## Getter Inheritance in Page Maps

Locators in `*-page-map.ts` MUST chain through parent getters — never scope directly from `this.page` when a container getter already exists. Define container getters first, then child element getters that inherit from them:

```typescript
// 1. Define the container getter
public get errorContainer(): Locator {
	return this.geoblockedPageContent.getByTestId("geoblockRedContainer");
}

// 2. Child elements inherit from the container getter
public get errorTitleLocator(): Locator {
	return this.errorContainer.getByTestId("geoblockTitle");
}

public get errorSubTitleLocator(): Locator {
	return this.errorContainer.getByTestId("geoblockSubTitle");
}
```

This ensures every locator is automatically scoped to its logical parent, matching the DOM hierarchy. If the container moves in the DOM, all child locators update automatically.

## Selector Priority Order

Use the highest-priority option that produces a stable, unique locator:

| Priority        | Method                                          | Example                                                         |
| --------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| 1 (best)        | `getByTestId`                                   | `page.getByTestId("submit-form")`                               |
| 2               | `getByRole` with name                           | `page.getByRole("button", { name: "Submit" })`                  |
| 3               | `getByRole` + `filter`                          | `.getByRole("listitem").filter({ hasText: "Pro Plan" })`        |
| 4               | `getByText` / `getByLabel` / `getByPlaceholder` | `page.getByLabel("Email address")`                              |
| 5               | Content-scoped `.locator()`                     | `.locator("div", { has: page.locator("img[alt='telegram']") })` |
| 6               | CSS attribute selectors                         | `.locator("[data-state='active']")`                             |
| 7 (last resort) | Raw CSS class / XPath                           | `.locator("[class*='StyledComponent']")` — add FALLBACK + TODO  |

## Playwright MCP — Staging Auth (MANDATORY)

Before navigating to any staging page via Playwright MCP, **always** set the OAuth2 JWT header to bypass the Google OAuth proxy:

```javascript
// browser_run_code — MUST run before any staging navigation
async (page) => {
    const jwt = process.env.OAUTH2_JWT; // or read from .env
    await page.context().setExtraHTTPHeaders({ Authorization: `Bearer ${jwt}` });
    await page.goto('https://staging-for-e2e-tests.teamgamdom.com/target-page', { waitUntil: 'domcontentloaded' });
}
```

Read the `OAUTH2_JWT` value from the project `.env` file. Without this header, staging redirects to Google OAuth and inspection fails.

## Verdex DOM Exploration Workflow

When building selectors via MCP, follow this progression:

```
1. browser_snapshot()          → Get accessibility tree with element refs
2. resolve_container(ref)      → Walk UP to find nearest stable anchor (testid, role, semantic tag)
3. inspect_pattern(ref, level) → Analyze sibling structure at ancestor level for repeating patterns
4. extract_anchors(ref, depth) → Deep scan descendants for headings, labels, unique text
5. Build locator               → Compose Container → Content → Role chain
```

Only escalate to the next step if the previous one didn't produce enough information for a unique selector.

## Good vs Bad Examples

**Bad — positional, breaks on DOM reorder:**

```typescript
page.getByRole("button", { name: "Add to Cart" }).nth(8);
page.locator(".btn-primary").first();
```

**Good — container-scoped, content-filtered, role-targeted:**

```typescript
page.getByTestId("product-card")
	.filter({ hasText: "iPhone 15 Pro" })
	.getByRole("button", { name: "Add to Cart" });
```

**Good — content anchor when no testid exists:**

```typescript
page.getByTestId("page-container")
	.locator("div", { has: page.locator("img[alt='telegram']") })
	.getByRole("button", { name: "Connect Telegram Account" });
```

## Prohibited selector patterns

- `.nth()`, `.first()`, `.last()` — positional selectors break on DOM changes
- Bare `page.locator("button")` without container scoping — too broad

## Last-resort selectors (use only when no better option exists)

- Raw CSS class selectors (`[class*='StyledComponent-sc-']`) — build-hashed, unstable. Add a FALLBACK + TODO comment.
- XPath ancestor traversal (`//ancestor::div[contains(@class,...)]`) — fragile. Add a FALLBACK + TODO comment.

## Fallback annotation (mandatory)

When Container → Content → Role cannot produce a stable selector:

```typescript
// FALLBACK: no data-testid within 5 ancestors of [element description]
// TODO: Revisit with data-testid once [component] is refactored
```
