import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "@playwright/test";

export class SoftblockModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get softblockModal(): Locator {
		return this.page.getByTestId("modalContainer");
	}

	public get softblockModalTitle(): Locator {
		return this.softblockModal.locator("h4");
	}

	public get softblockModalCloseButton(): Locator {
		return this.softblockModal.getByTestId("closeButton");
	}
}
