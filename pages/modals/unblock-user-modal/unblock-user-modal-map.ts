import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class UnblockUserModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.getByTestId("unblock-user-modal-dialog-wrapper");
	}

	public get unblockButton(): Locator {
		return this.modalLocator.getByTestId(
			"unblock-user-modal-dialog-unblock-button",
		);
	}

	public get cancelButton(): Locator {
		return this.modalLocator.getByTestId(
			"unblock-user-modal-dialog-cancel-button",
		);
	}
}
