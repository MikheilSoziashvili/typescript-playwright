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

	public get changeUsernameInput(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-username-input",
		);
	}

	public get saveUsernameButton(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-save-username",
		);
	}

	public get changeEmailInput(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-email-input",
		);
	}

	public get saveEmailButton(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-save-email",
		);
	}

	public get phoneNumberContainer(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-phone-container",
		);
	}

	public get changePhoneInput(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-phone-input",
		);
	}

	public get savePhoneButton(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-save-phone",
		);
	}

	public get phoneValidationError(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-phone-error",
		);
	}

	public get usernameValidationError(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-username-error",
		);
	}

	public get emailValidationError(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-email-error",
		);
	}

	public get changePasswordButton(): Locator {
		return this.page.getByTestId("change-user-password-button");
	}

	public userProfileLeftMenuItem(dropdownItem: UserMenuOption): Locator {
		return this.leftMenu.locator(`a`, {
			hasText: `${dropdownItem}`,
		});
	}
}
