import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class ContinueModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.getByTestId("confirmation-modal-body");
	}

	public get modalFooterContainer(): Locator {
		return this.page.getByTestId("confirmation-modal-footer");
	}

	public get continueButton(): Locator {
		return this.modalFooterContainer.getByTestId(
			"confirmation-modal-continue-button",
		);
	}

	public get cancelButton(): Locator {
		return this.modalFooterContainer.getByTestId(
			"confirmation-modal-cancel-button",
		);
	}
}
