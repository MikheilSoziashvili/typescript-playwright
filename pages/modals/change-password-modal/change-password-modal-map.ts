import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class ChangePasswordModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalContainer(): Locator {
		return this.page.getByTestId("change-password-modal-dialog");
	}

	public get modalContent(): Locator {
		return this.modalContainer.getByTestId("change-password-modal-content");
	}

	public get oldPasswordInput(): Locator {
		return this.modalContent.getByTestId("chg-password-cur").locator("input");
	}

	public get newPasswordInput(): Locator {
		return this.modalContent.getByTestId("chg-password-new").locator("input");
	}

	public get repeatNewPasswordInput(): Locator {
		return this.modalContent.getByTestId("chg-password-conf").locator("input");
	}

	public get changePasswordButton(): Locator {
		return this.modalContent.getByTestId("chg-password-sbt");
	}

	public inputError(text: string): Locator {
		return this.modalContent.locator('[data-testid$="-error"]', {
			hasText: text,
		});
	}
}
