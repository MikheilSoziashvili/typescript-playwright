import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class ChangePasswordModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalContainer(): Locator {
		return this.page.getByTestId("modalContainer");
	}

	public get modalHeader(): Locator {
		return this.page.getByTestId("modalHeader");
	}

	public get modalTitle(): Locator {
		return this.page.getByTestId("modalTitle");
	}

	public get closeButton(): Locator {
		return this.page.getByTestId("closeButton");
	}

	public get modalBody(): Locator {
		return this.page.getByTestId("modalBody");
	}

	public get changePasswordModalBody(): Locator {
		return this.page.getByTestId("change-password-modal-body");
	}

	public get oldPasswordInput(): Locator {
		return this.getInputField("old-password", this.changePasswordModalBody);
	}

	public get newPasswordInput(): Locator {
		return this.getInputField("new-password", this.changePasswordModalBody);
	}

	public get repeatNewPasswordInput(): Locator {
		return this.getInputField(
			"repeat-new-password",
			this.changePasswordModalBody,
		);
	}

	public get modalFooter(): Locator {
		return this.page.getByTestId("modalFooter");
	}

	public get changePasswordModalFooter(): Locator {
		return this.page.getByTestId("change-password-modal-footer");
	}

	public get changePasswordButton(): Locator {
		return this.page.getByTestId("change-password-modal");
	}
}
