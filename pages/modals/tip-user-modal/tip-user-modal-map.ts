import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TipUserModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.getByTestId("tipUserModalContent");
	}

	public get modalContainer(): Locator {
		return this.page.getByTestId("tipUser-modal");
	}

	public get titleContainer(): Locator {
		return this.modalLocator.getByTestId("tipUserContainerTitle");
	}

	public get inputContainer(): Locator {
		return this.modalLocator.getByTestId("tipUserInputContainer");
	}

	public get tipAmountField(): Locator {
		return this.inputContainer.locator("input");
	}

	public get clearAmountButton(): Locator {
		return this.inputContainer.getByTestId("clearInputButton");
	}

	public get warningContainer(): Locator {
		return this.modalLocator.getByTestId("tipUserWarningContainer");
	}

	public get tipButton(): Locator {
		return this.modalContainer.getByTestId("tipUser-button");
	}
}
