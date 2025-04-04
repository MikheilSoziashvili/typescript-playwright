import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class SecurityAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get securityPageContainer(): Locator {
		return this.page.getByTestId("securityPageContent");
	}

	public get withdrawSettingsContainer(): Locator {
		return this.securityPageContainer.getByTestId(
			"withdrawSettingContainer",
		);
	}

	public get withdrawSettingsHeader(): Locator {
		return this.withdrawSettingsContainer.getByTestId("headerTitle");
	}

	public get saveButtonContainer(): Locator {
		return this.withdrawSettingsContainer.getByTestId("saveFieldGroup");
	}

	public get saveButton(): Locator {
		return this.saveButtonContainer.getByTestId(
			"saveWithdrawsSettingsButton",
		);
	}

	public get blockUserContainer(): Locator {
		return this.withdrawSettingsContainer.getByTestId("blockFieldGroup");
	}

	public get blockUserInput(): Locator {
		return this.blockUserContainer.getByTestId("blockFieldInput");
	}

	public get alertUserContainer(): Locator {
		return this.withdrawSettingsContainer.getByTestId("alertFieldGroup");
	}

	public get alertUserInput(): Locator {
		return this.withdrawSettingsContainer.getByTestId("alertFieldInput");
	}
}
