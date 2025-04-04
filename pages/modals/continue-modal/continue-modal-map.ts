import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class ContinueModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.getByTestId("confirmation-modal-body");
	}

	public get continueButton(): Locator {
		return this.modalLocator.getByTestId(
			"confirmation-modal-continue-button",
		);
	}

	public get cancelButton(): Locator {
		return this.modalLocator.getByTestId(
			"confirmation-modal-cancel-button",
		);
	}
}
