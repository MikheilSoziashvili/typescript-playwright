import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class WelcomeBonusModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.getByTestId("welcome-bonus-modal-dialog");
	}

	public get claimButton(): Locator {
		return this.modalLocator.getByTestId("welcome-bonus-modal-submit");
	}

	public get codeInputFiled(): Locator {
		return this.modalLocator.getByTestId("welcome-bonus-modal-input-input");
	}
}
