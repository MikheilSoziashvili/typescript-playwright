import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class UnblockUserModalMapV4 extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocatorV4(): Locator {
		return this.page.getByTestId("unblock-user-modal-dialog-wrapper");
	}

	public get unblockButtonV4(): Locator {
		return this.modalLocatorV4.getByTestId(
			"unblock-user-modal-dialog-unblock-button",
		);
	}

	public get cancelButtonV4(): Locator {
		return this.modalLocatorV4.getByTestId(
			"unblock-user-modal-dialog-cancel-button",
		);
	}
}
