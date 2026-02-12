import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TipUserModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.getByTestId("tip-user-v4-modal-dialog-wrapper");
	}

	public get titleContainer(): Locator {
		return this.modalLocator.getByTestId("tip-user-v4-modal-title");
	}

	public get inputContainer(): Locator {
		return this.modalLocator.getByTestId(
			"tip-user-v4-modal-tip-amount-container",
		);
	}

	public get tipAmountField(): Locator {
		return this.inputContainer.getByTestId(
			"tip-user-v4-modal-tip-amount-input",
		);
	}

	public get warningContainer(): Locator {
		return this.modalLocator.getByTestId("tip-user-v4-modal-warning");
	}

	public get tipButton(): Locator {
		return this.modalLocator.getByTestId("tip-user-v4-modal-tip-button");
	}
}
