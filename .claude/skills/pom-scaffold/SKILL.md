---
name: pom-scaffold
description: >
  Scaffold complete 4-file Page Object Model structures (map, page, asserter, steps) with
  fixture registration for the Gamdom E2E framework. Handles pages, admin pages, modals, and
  components with correct base classes, imports, decorators, and endpoint wiring.
argument-hint: "[page-name or page-description]"
---

# POM Scaffold — Gamdom E2E Framework

You are scaffolding a new Page Object for the Gamdom E2E framework. This skill generates all required files AND registers the page in the fixture system. Follow every step exactly.

## Workflow

### Step 1 — Determine Page Type & Location

Ask yourself: what kind of UI element is this?

| Type | Base Class | Directory | Fixture File | Files |
|------|-----------|-----------|-------------|-------|
| **Page** | `BasePage<Map>` | `pages/{name}/` | `fixtures/gamdom-pages.ts` | 4 files |
| **Admin Page** | `BasePage<Map>` | `pages/admin/{name}/` | `fixtures/admin-pages-fixtures.ts` | 4 files |
| **Child Admin** | `BasePage<Map>` | `pages/admin/{parent}/{name}/` | `fixtures/admin-pages-fixtures.ts` | 4 files |
| **Modal** | `BaseModal<Map>` | `pages/modals/{name}/` | `fixtures/modal-fixtures.ts` | 4 files |
| **Component** | `BaseComponent<Map>` | `pages/components/{name}/` | `fixtures/components-fixtures.ts` | 3 files (no steps) |
| **Game Page** | `BasePage<Map>` | `pages/{name}/` | `fixtures/game-pages-fixtures.ts` | 4 files |

**Directory naming**: Always kebab-case (e.g., `user-settings`, `promo-campaigns-admin`).

### Step 2 — Check for Existing Page Objects

Before creating anything, search for existing page objects that cover the same page:

```
Search pages/ for similar names
Check pages/index.ts for any existing registration
```

If a page object already exists, extend it instead of creating a duplicate.

### Step 3 — Generate Files

Create all files in one go. Every file MUST follow the exact patterns below.

#### File 1: Map (`{name}-page-map.ts`)

```typescript
import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class YourPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	// Add locators as getters or methods
	// Selector priority: getByTestId > getByRole > locator with text filter > .filter() > .nth() > XPath
	public get exampleElement(): Locator {
		return this.page.getByTestId("example");
	}

	// Parametric locator example
	public tabByName(name: string): Locator {
		return this.page.getByTestId(`tab-${name}`);
	}
}
```

**Rules**: Only locators here. No actions, no assertions, no logic. No `@step()` decorator.

#### File 2: Page (`{name}-page.ts`)

For **pages** (extends `BasePage`):

```typescript
import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { YOUR_ENDPOINT } from "@constants/page-endpoints";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { YourPageMap } from "./{name}-page-map";
import { YourPageAsserter } from "./{name}-page-asserter";
import { YourPageSteps } from "./{name}-page-steps";

export class YourPage extends BasePage<YourPageMap> {
	public constructor(page: Page) {
		super(page, new YourPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [YOUR_ENDPOINT] },
		});
	}

	public override assertThat(): YourPageAsserter {
		return new YourPageAsserter(this);
	}

	public steps(): YourPageSteps {
		return new YourPageSteps(this);
	}

	@step()
	public async exampleAction(): Promise<void> {
		await this.map.exampleElement.click();
	}
}
```

For **modals** (extends `BaseModal`):

```typescript
import { BaseModal } from "@base/base-modal";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { YourModalMap } from "./{name}-map";
import { YourModalAsserter } from "./{name}-asserter";
import { YourModalSteps } from "./{name}-steps";

export class YourModal extends BaseModal<YourModalMap> {
	public constructor(page: Page) {
		super(page, new YourModalMap(page));
	}

	public assertThat(): YourModalAsserter {
		return new YourModalAsserter(this);
	}

	public steps(): YourModalSteps {
		return new YourModalSteps(this);
	}

	@step()
	public async exampleAction(): Promise<void> {
		await this.map.exampleElement.click();
	}
}
```

For **components** (extends `BaseComponent`):

```typescript
import { BaseComponent } from "@base/base-component";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { YourComponentMap } from "./{name}-map";
import { YourComponentAsserter } from "./{name}-asserter";

export class YourComponent extends BaseComponent<YourComponentMap> {
	public constructor(page: Page) {
		super(page, new YourComponentMap(page));
	}

	public assertThat(): YourComponentAsserter {
		return new YourComponentAsserter(this);
	}

	@step()
	public async exampleAction(): Promise<void> {
		await this.map.exampleElement.click();
	}
}
```

**Note**: Components do NOT have a steps file. They also do NOT have a `steps()` method.

#### File 3: Asserter (`{name}-page-asserter.ts`)

```typescript
import { BaseAsserter } from "@base/base-asserter";
import { YourPage } from "./{name}-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";

export class YourPageAsserter extends BaseAsserter<YourPage> {
	public constructor(page: YourPage) {
		super(page);
	}

	@step()
	public async pageIsLoaded(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.exampleElement,
		]);
	}
}
```

**Rules**: Only assertions here. Access locators via `this.gamdomPage.map.*`. Use inherited helpers: `checkElementsAreVisible()`, `checkElementsAreNotVisible()`, `checkElementsHaveText()`.

#### File 4: Steps (`{name}-page-steps.ts`) — NOT for components

```typescript
import { BasePageStep } from "@pages/base/base-page-step";
import { YourPage } from "./{name}-page";
import { step } from "decorators/step";

export class YourPageSteps extends BasePageStep<YourPage> {
	public constructor(gamdomPage: YourPage) {
		super(gamdomPage);
	}

	@step()
	public async navigateAndVerifyLoaded(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().pageIsLoaded();
	}
}
```

**Rules**: Orchestrates page actions + assertions into business sequences. Access page via `this.gamdomPage`.

### Step 4 — Register in `pages/index.ts`

Add the import and register in the correct category object:

| Page Type | Register In |
|-----------|------------|
| User-facing page | `GamdomPages` |
| Admin page | `GamdomAdminPages` |
| Game page | `GamePages` |
| Component | `Components` |
| Modal | `Modals` |
| External page | `ExternalPages` |

```typescript
// 1. Add import at top of pages/index.ts
import { YourPage } from "./your-page/your-page";

// 2. Add to correct object (e.g., GamdomPages)
export const GamdomPages = {
	// ... existing entries
	yourPage: YourPage,    // camelCase key, PascalCase value
} as const;
```

### Step 5 — Register Fixture

Add to the correct fixture file. Each fixture file follows this pattern:

```typescript
// 1. Add import
import { YourPage } from "@pages/your-page/your-page";

// 2. Add to type
export type GamdomPages = {
	// ... existing entries
	yourPage: YourPage;
};

// 3. Add fixture registration
export const gamdomPagesFixtures = base.extend<GamdomPages>({
	// ... existing entries
	yourPage: sessionAwarePage(YourPage),
});
```

**Import path aliases by fixture file:**

| Fixture File | Import Prefix |
|-------------|--------------|
| `gamdom-pages.ts` | `@pages/{name}/{name}-page` |
| `admin-pages-fixtures.ts` | `@pages/admin/{name}/{name}-page` |
| `game-pages-fixtures.ts` | `@pages/{name}/{name}-page` |
| `modal-fixtures.ts` | `@modals/{name}/{name}` |
| `components-fixtures.ts` | `@components/{name}/{name}` |

### Step 6 — Add Endpoint (if navigable)

If the page has a URL endpoint, add it to `constants/page-endpoints.ts`:

```typescript
export const YOUR_PAGE_ENDPOINT = "/your-page-path";
```

**Skip this for**: modals, components, child admin pages that don't have their own URL.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Directory | kebab-case | `user-settings/` |
| Files | kebab-case matching directory | `user-settings-page.ts` |
| Page class | PascalCase + `Page` suffix | `UserSettingsPage` |
| Map class | PascalCase + `PageMap` suffix | `UserSettingsPageMap` |
| Asserter class | PascalCase + `PageAsserter` suffix | `UserSettingsPageAsserter` |
| Steps class | PascalCase + `PageSteps` suffix | `UserSettingsPageSteps` |
| Fixture key | camelCase + `Page` suffix | `userSettingsPage` |
| Endpoint const | SCREAMING_SNAKE + `_ENDPOINT` | `USER_SETTINGS_PAGE_ENDPOINT` |

**Modal naming**: Replace `Page` with `Modal` (e.g., `WalletModal`, `WalletModalMap`).
**Component naming**: Use the component name directly (e.g., `Chat`, `ChatMap`, `ChatAsserter`).

## Mandatory Rules

- **`@step()` decorator** on ALL public methods in page, asserter, and steps files (NOT in map)
- **Path aliases**: `@pages/*`, `@base/*`, `@modals/*`, `@components/*`, `@constants/*`, `@enums/*`, `@core/*`
- **Tabs** for indentation (width 4), trailing commas everywhere
- **async/await only** — no `.then()` or `.catch()`
- **Return types** explicitly declared on all public methods
- **`import { expect } from "@playwright/test"`** in asserter files
- **`import { step } from "decorators/step"`** in page, asserter, steps files
- **Constructor parameter naming**: `page: Page` for page/map constructors, `page: YourPage` for asserter, `gamdomPage: YourPage` for steps

## Checklist Before Done

- [ ] All 4 files created (3 for components)
- [ ] Each file extends the correct base class
- [ ] `assertThat()` and `steps()` return correct concrete types
- [ ] `@step()` on all public methods (except map)
- [ ] Registered in `pages/index.ts` in correct category
- [ ] Registered in correct fixture file with `sessionAwarePage()`
- [ ] Endpoint added to `page-endpoints.ts` (if navigable)
- [ ] No duplicate page objects exist for same UI
- [ ] Files compile: `npx tsc --noEmit --pretty`
