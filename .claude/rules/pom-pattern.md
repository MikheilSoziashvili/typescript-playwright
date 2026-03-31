---
paths:
  - "pages/**/*.ts"
  - "fixtures/*pages*.ts"
  - "fixtures/*components*.ts"
  - "fixtures/*modal*.ts"
---

# Page Object Model — Four-File Pattern

Every page/component has up to four files with strict separation of concerns:

## 1. Map (`*-page-map.ts`) — Locator definitions only

```typescript
import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class ExamplePageMap extends BaseMap {
    public constructor(page: Page) {
        super(page);
    }

    public get submitButton(): Locator {
        return this.page.getByTestId("submitButton");
    }

    public get pageContent(): Locator {
        return this.page.getByTestId("pageContent");
    }

    public getItemByName(name: string): Locator {
        return this.pageContent.locator(`[data-name="${name}"]`);
    }
}
```

## 2. Page (`*-page.ts`) — Actions, navigation, component composition

```typescript
import { BasePage } from "@base/base-page";
import { ExamplePageMap } from "./example-page-map";
import { ExamplePageAsserter } from "./example-page-asserter";
import { ExamplePageSteps } from "./example-page-steps";
import { Page } from "@playwright/test";
import { step } from "decorators/step";

export class ExamplePage extends BasePage<ExamplePageMap> {
    public constructor(page: Page) {
        super(page, new ExamplePageMap(page));
    }

    public override assertThat(): ExamplePageAsserter {
        return new ExamplePageAsserter(this);
    }

    public steps(): ExamplePageSteps {
        return new ExamplePageSteps(this);
    }

    public override async navigate(): Promise<void> {
        await super.navigate({ endpoint: { paths: ["/example"] } });
    }

    @step()
    public async clickSubmit(): Promise<void> {
        await this.map.submitButton.click();
    }
}
```

## 3. Asserter (`*-page-asserter.ts`) — Assertions only

```typescript
import { BaseAsserter } from "@base/base-asserter";
import { ExamplePage } from "./example-page";
import { step } from "@decorators/step";

export class ExamplePageAsserter extends BaseAsserter<ExamplePage> {
    public constructor(page: ExamplePage) {
        super(page);
    }

    @step()
    public async pageIsLoaded(): Promise<void> {
        await this.checkElementsAreVisible([
            this.gamdomPage.map.pageContent,
        ]);
    }

    @step()
    public async itemHasText(name: string, text: string): Promise<void> {
        await this.checkElementsHaveText([
            { locator: this.gamdomPage.map.getItemByName(name), expectedText: text },
        ]);
    }
}
```

## 4. Steps (`*-page-steps.ts`) — Multi-action sequences

```typescript
import { BasePageStep } from "@base/base-page-step";
import { ExamplePage } from "./example-page";
import { step } from "@decorators/step";

export class ExamplePageSteps extends BasePageStep<ExamplePage> {
    public constructor(gamdomPage: ExamplePage) {
        super(gamdomPage);
    }

    @step()
    public async submitAndVerify(expectedText: string): Promise<void> {
        await this.gamdomPage.clickSubmit();
        await this.gamdomPage.assertThat().itemHasText("result", expectedText);
    }
}
```

## Component/Modal hierarchy

`BaseComponent<T>` / `BaseModal<T>` follow the same pattern. Attach to pages via getters:
```typescript
public get loginModal(): LoginModal {
    return new LoginModal(this.page);
}
```

## Locator strategy (preferred order)

1. `page.getByTestId("...")` — primary
2. `parent.getByTestId("...")` — scoped
3. `page.locator("css", { hasText: "..." })` — with text filter
4. `.filter({ has: page.locator(...) })` — filtered
5. `.nth(index)` — positional
6. XPath — last resort

## Creating a new Page Object

1. Create directory: `pages/your-page/` (or `pages/admin/your-page/`)
2. Create four files following skeletons above
3. Map extends `BaseMap`, Page extends `BasePage<YourMap>`, Asserter extends `BaseAsserter<YourPage>`, Steps extends `BasePageStep<YourPage>`
4. Page must override `assertThat()` and `steps()`
5. Add `@step()` to ALL public methods in page, asserter, and steps
6. Register fixture: `yourPage: sessionAwarePage(YourPage)` in appropriate fixture file

## Asserter methods — always use base-asserter wrappers

Never call raw `expect()` directly inside asserter methods for element state checks. Always use the `BaseAsserter` wrapper methods — they add consistent step labelling and options support:

| Raw `expect()` (❌ avoid) | `BaseAsserter` method (✅ use) |
|---|---|
| `expect(el).toBeVisible()` | `checkElementsAreVisible([el])` |
| `expect(el).not.toBeVisible()` | `checkElementsAreNotVisible([el])` |
| `expect(el).toBeHidden()` | `checkElementsAreHidden([el])` |
| `expect(el).toBeEnabled()` | `checkElementsAreEnabled([el])` |
| `expect(el).toBeDisabled()` | `checkElementsAreDisabled([el])` |
| `expect(el).toHaveText(t)` | `checkElementsHaveText([{ locator: el, expectedText: t }])` |
| `expect(el).toContainText(t)` | `checkElementsContainText([{ locator: el, expectedText: t }])` |
| `expect(el).toHaveValue(v)` | `checkElementsHaveValue([{ locator: el, expectedValue: v }])` |
| `expect(el).toBeEmpty()` | `checkElementsAreEmpty([el])` |
| `expect(el).not.toBeEmpty()` | `checkElementsAreNotEmpty([el])` |
| `expect(el).toBeChecked()` / `.not.toBeChecked()` | `assertCheckedState([{ locator: el, checked: bool }])` |
| `expect(el).toBeEnabled()` / `.toBeDisabled()` with label | `assertEnabledState([{ locator: el, enabled: bool, label }])` |

Raw `expect()` is still correct for non-element assertions (numeric comparisons, string equality, counts, etc.) and inside `verifyElementIsCentered` / `expectLocatorInside` / visual checks that don't map to the above.

## Rules

- Locators ONLY in map files
- Assertions ONLY in asserter files
- Never mix concerns across the four files
- `@step()` required on all public methods (enforced by `yarn lint:step-decorators`)
- In asserter methods, always use `BaseAsserter` wrapper methods over raw `expect()` for element state checks (see table above)

## AI-Assisted Workflow

When creating a new POM as part of a test implementation:
- Use `/implement-test {TEST_KEY}` — reads the scaffold `.md`, detects pages without POMs, navigates to staging via Playwright MCP, snapshots the DOM, builds real selectors, and scaffolds all 4 files + fixture automatically
- Use the `pom-scaffold` skill for the full file skeletons and generation procedure when scaffolding standalone
