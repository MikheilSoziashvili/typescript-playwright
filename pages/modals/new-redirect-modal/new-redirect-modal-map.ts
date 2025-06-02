import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class NewRedirectModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get newRedirectModalContainer(): Locator {
		return this.page.getByTestId(`modalContainer`);
	}

	public get newRedirectModalTitle(): Locator {
		return this.newRedirectModalContainer.getByTestId(`modalTitle`);
	}

	public get createRedirectButton(): Locator {
		return this.page.locator("button", {
			hasText: "Create Redirect",
		});
	}

	public get editRedirectButton(): Locator {
		return this.page.locator("button", {
			hasText: "Edit Redirect",
		});
	}

	public get fromPathInput(): Locator {
		return this.page.locator('input[name="fromPath"]');
	}

	public get toPathInput(): Locator {
		return this.page.locator('input[name="toPath"]');
	}
}
