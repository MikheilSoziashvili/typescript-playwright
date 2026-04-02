---
paths:
    - "pages/**/*-page-map.ts"
---

# playwright-cli Selector Authoring Rules

When generating or modifying locators in `*-page-map.ts` files:

## Required: Container → Content → Role

Every locator MUST follow this three-layer scoping hierarchy:

1. **Container** — Find a stable ancestor anchor. Prefer `data-testid`, then semantic landmarks (`role`, `<section>`, `<nav>`), then unique `data-*` attributes.
2. **Content** — Disambiguate among siblings using `.filter({ hasText: "unique text" })`, `.locator("tag", { has: page.locator("img[alt='...']") })`, or other content-based filters.
3. **Role** — Target the interactive element by accessibility role: `.getByRole("button", { name: "Action" })`.

Not every locator needs all three layers — skip Content if the Container + Role combination is already unique.

## Getter Inheritance in Page Maps

Locators in `*-page-map.ts` MUST chain through parent getters — never scope directly from `this.page` when a container getter already exists:

```typescript
public get errorContainer(): Locator {
	return this.geoblockedPageContent.getByTestId("geoblockRedContainer");
}

public get errorTitleLocator(): Locator {
	return this.errorContainer.getByTestId("geoblockTitle");
}
```

## Selector Priority Order

| Priority        | Method                                          | Example                                                         |
| --------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| 1 (best)        | `getByTestId`                                   | `page.getByTestId("submit-form")`                               |
| 2               | `getByRole` with name                           | `page.getByRole("button", { name: "Submit" })`                  |
| 3               | `getByRole` + `filter`                          | `.getByRole("listitem").filter({ hasText: "Pro Plan" })`        |
| 4               | `getByText` / `getByLabel` / `getByPlaceholder` | `page.getByLabel("Email address")`                              |
| 5               | Content-scoped `.locator()`                     | `.locator("div", { has: page.locator("img[alt='telegram']") })` |
| 6               | CSS attribute selectors                         | `.locator("[data-state='active']")`                             |
| 7 (last resort) | Raw CSS class / XPath                           | `.locator("[class*='StyledComponent']")`                        |

## Use { exact: true } for name-based locators

When using `getByRole`, `getByText`, or `getByLabel`, pass `{ exact: true }` to prevent partial matches:

```typescript
// ❌ Matches "Submit" AND "Submit Form"
page.getByRole("button", { name: "Submit" });

// ✅ Matches only "Submit"
page.getByRole("button", { name: "Submit", exact: true });
```

## Prohibited selector patterns

- `.nth()`, `.first()`, `.last()` — positional selectors break on DOM changes
- Bare `page.locator("button")` without container scoping — too broad

## Last-resort selectors

- Raw CSS class selectors (`[class*='StyledComponent-sc-']`) — build-hashed, unstable. Use only when no data-testid or semantic anchor exists.
- XPath ancestor traversal (`//ancestor::div[contains(@class,...)]`) — fragile. Use only as a last resort.
- Do **not** add comments to locators — no FALLBACK, TODO, or other annotations.

## Full inspection workflow

For staging auth, DOM exploration, and the complete step-by-step inspection procedure, see `.claude/skills/mcp-selector-authoring.md`.
