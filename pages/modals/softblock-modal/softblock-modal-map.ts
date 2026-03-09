import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "@playwright/test";

export class SoftblockModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get softblockModal(): Locator {
		return this.page.getByTestId("soft-block-modal-dialog");
	}

	public get softblockModalTitle(): Locator {
		return this.softblockModal.getByTestId("soft-block-modal-text");
	}

	public get softblockModalCloseButton(): Locator {
		return this.softblockModal.getByTestId("soft-block-modal-close-button");
	}
}
