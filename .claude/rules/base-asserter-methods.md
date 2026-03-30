# BaseAsserter Utility Methods

All asserter classes extend `BaseAsserter`, which provides batched, `@step()`-labelled helpers that run assertions in parallel. Always use these instead of raw `expect()` loops in `*-page-asserter.ts` files.

## Method mapping

| Raw `expect()` pattern                                     | Use instead                                              |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| `expect(locator).toBeVisible()` × N                        | `checkElementsAreVisible([...])`                         |
| `expect(locator).not.toBeVisible()` × N                    | `checkElementsAreNotVisible([...])`                      |
| `expect(locator).toBeHidden()` × N                         | `checkElementsAreHidden([...])`                          |
| `expect(locator).toHaveValue(v)` × N                       | `checkElementsHaveValue([{ locator, expectedValue }])`   |
| `expect(locator).toHaveText(t)` × N                        | `checkElementsHaveText([{ locator, expectedText }])`     |
| `expect(locator).toContainText(t)` × N                     | `checkElementsContainText([{ locator, expectedText }])`  |
| `expect(locator).toHaveText(allowedSet)` × N               | `checkEachElementTextIsInSet([...], allowedTexts)`       |
| `expect(locator).toBeEmpty()` × N                          | `checkElementsAreEmpty([...])`                           |
| `expect(locator).not.toBeEmpty()` × N                      | `checkElementsAreNotEmpty([...])`                        |
| `expect(locator).toBeEnabled()` × N                        | `checkElementsAreEnabled([...])`                         |
| `expect(locator).toBeDisabled()` × N                       | `checkElementsAreDisabled([...])`                        |
| `expect(value).toBeDefined()` × N                          | `checkElementsAreDefined([{ value, message }])`          |
| `expect(a).toBe(b)` on strings × N                         | `checkStringElementsAreEqual(expected[], actual[])`      |
| `expect(locator).toBeChecked()` / `.not.toBeChecked()` × N | `assertCheckedState([{ locator, checked, label? }])`     |
| `expect(locator).toBeEnabled()` / `.toBeDisabled()` × N    | `assertEnabledState([{ locator, enabled, label? }])`     |
| `expect(condition).toBeTruthy()` × N                       | `assertAllTruthy([{ condition, message }])`              |
| `expect(slider).toHaveAttribute(ARIA_DISABLED, v)`         | `verifySliderState(slider, expected)`                    |
| `expect(locator).toHaveClass(pattern)`                     | `expectElementToHaveClass(locator, value)`               |
| Manual `page.url()` + `expect(...).toBe(url)`              | `waitForAndVerifyCurrentUrlIs(url)`                      |
| Manual new-tab URL + `expect(...).toBe(url)`               | `verifyNewTabUrl(url)` / `verifyNewTabUrlParts(parts[])` |
| Manual `boundingBox()` containment checks                  | `expectLocatorInside(inner, outer)`                      |
| Manual `boundingBox()` vs `window.innerWidth/Height`       | `expectElementWithinViewport(el)`                        |

## Rules

- Never write a raw `expect(locator).toBeVisible()` loop in an asserter — use `checkElementsAreVisible([...])`
- Never write a raw `expect(locator).toBeHidden()` loop — use `checkElementsAreHidden([...])`
- Never write raw `expect(locator).toHaveText()` / `toContainText()` loops — use `checkElementsHaveText` / `checkElementsContainText`
- Never write raw `expect(locator).toBeEnabled()` / `toBeDisabled()` loops — use `checkElementsAreEnabled` / `checkElementsAreDisabled` or `assertEnabledState`
- Never write raw `expect(locator).toBeChecked()` / `not.toBeChecked()` loops — use `assertCheckedState`
- Never write raw `expect(condition).toBeTruthy()` loops — use `assertAllTruthy`
- Never write raw `expect(value).toBeDefined()` calls in bulk — use `checkElementsAreDefined`
- Never write manual `boundingBox()` arithmetic — use `expectLocatorInside` / `expectElementWithinViewport`

## Custom failure messages

**Always** pass a meaningful custom message to `expect()` (second argument) and to BaseAsserter helpers that accept a `message` parameter. This is the primary signal in failing logs — without it, Playwright only prints the raw locator or value, which is often unreadable.

### When a message is required

- Any raw `expect()` that remains (e.g. single-element assertions not covered by a helper)
- `checkElementsAreVisible(elements, timeout, message)` — always pass `message`
- `checkElementsAreNotVisible(elements, timeout, message)` — always pass `message`
- `checkElementsAreHidden(elements, { message })` — always pass `message`
- `checkElementsAreDefined([{ value, message }])` — `message` is part of the item object, always fill it
- `assertCheckedState([{ locator, checked, label }])` — always fill `label`
- `assertEnabledState([{ locator, enabled, label }])` — always fill `label`
- `assertAllTruthy([{ condition, message }])` — `message` is part of the item object, always fill it

### Message conventions

- Describe the **expected state**, not the action: `"Submit button should be visible after form fill"` not `"checking submit button"`
- Include dynamic context when relevant: `"Balance should equal ${expectedBalance} after deposit"`
- For multi-element helpers, a single shared message is fine when all elements belong to the same logical group: `"All dashboard widgets should be visible on load"`

### Examples

```typescript
// ❌ Wrong — no message, failure log only shows locator internals
await this.checkElementsAreVisible([
    this.gamdomPage.map.header,
    this.gamdomPage.map.balanceWidget,
]);

await expect(this.gamdomPage.map.errorBanner).toBeVisible();

// ✅ Correct — message explains what failed and why it matters
await this.checkElementsAreVisible(
    [this.gamdomPage.map.header, this.gamdomPage.map.balanceWidget],
    undefined,
    "Header and balance widget should be visible after login",
);

await expect(
    this.gamdomPage.map.errorBanner,
    "Error banner should appear after submitting invalid credentials",
).toBeVisible();

// ✅ Correct — assertAllTruthy with per-condition messages
await this.assertAllTruthy([
    { condition: balance > 0, message: "Balance should be positive after deposit" },
    { condition: isLoggedIn, message: "User should still be logged in after deposit" },
]);

// ✅ Correct — assertCheckedState with label
await this.assertCheckedState([
    { locator: this.gamdomPage.map.termsCheckbox, checked: true, label: "Terms checkbox" },
    { locator: this.gamdomPage.map.newsletterCheckbox, checked: false, label: "Newsletter checkbox" },
]);
```
