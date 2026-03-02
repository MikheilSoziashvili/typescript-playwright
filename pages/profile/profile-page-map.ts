import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { UserMenuOption } from "@enums/user-menu-options";

export class ProfilePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get leftMenu(): Locator {
		return this.page.getByTestId("profile-layout-tabs-container");
	}

	public get logOutButton(): Locator {
		return this.leftMenu.getByTestId("prof-ttl");
	}

	public get verifyButton(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-verify-email",
		);
	}

	public get emailContainer(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-email-container",
		);
	}

	public get usernameContainer(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-username-container",
		);
	}

	public get changeUsernameButton(): Locator {
		return this.usernameContainer.getByTestId("changeButton");
	}

	public get changeUsernameInput(): Locator {
		return this.getInputField("displayUsername", this.usernameContainer);
	}

	public get saveUsernameButton(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-save-username",
		);
	}

	public get changeEmailInput(): Locator {
		return this.getInputField("email", this.emailContainer);
	}

	public get saveEmailButton(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-save-email",
		);
	}

	public get phoneNumberContainer(): Locator {
		return this.page.getByTestId("profilePhoneContainer");
	}

	public get changePhoneButton(): Locator {
		return this.phoneNumberContainer.getByTestId("changeButton");
	}

	public get changePhoneInput(): Locator {
		return this.getInputField("phone", this.phoneNumberContainer);
	}

	public get savePhoneButton(): Locator {
		return this.phoneNumberContainer.getByTestId("saveButton");
	}

	public userProfileLeftMenuItem(dropdownItem: UserMenuOption): Locator {
		return this.leftMenu.locator(`a`, {
			hasText: `${dropdownItem}`,
		});
	}
}
