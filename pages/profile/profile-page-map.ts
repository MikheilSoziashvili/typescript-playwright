import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { UserMenuOption } from "@enums/user-menu-options";

export class ProfilePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get leftMenu(): Locator {
		return this.page.getByTestId("profileLeftMenu");
	}

	public get logOutButton(): Locator {
		return this.leftMenu.getByTestId("logoutButton");
	}

	public get hideStatisticsToggle(): Locator {
		return this.page.getByTestId("profileHideStatistics").locator("input");
	}

	public get hideDetailsToggle(): Locator {
		return this.page.getByTestId("profileHideDetails").locator("input");
	}

	public get verifyButton(): Locator {
		return this.page.locator("button:has-text('Verify')");
	}

	public get continueVerificationButton(): Locator {
		return this.page.locator('button:has-text("Continue")');
	}

	public get emailNumberContainer(): Locator {
		return this.page.getByTestId("profileEmailContainer");
	}

	public get usernameContainer(): Locator {
		return this.page.getByTestId("profileUsernameContainer");
	}

	public get changeUsernameButton(): Locator {
		return this.usernameContainer.getByTestId("changeButton");
	}

	public get changeUsernameInput(): Locator {
		return this.getInputField("username", this.usernameContainer);
	}

	public get saveUsernameButton(): Locator {
		return this.usernameContainer.getByTestId("saveButton");
	}

	public get changeEmailButton(): Locator {
		return this.emailNumberContainer.getByTestId("changeButton");
	}

	public get changeEmailInput(): Locator {
		return this.getInputField("email", this.emailNumberContainer);
	}

	public get saveEmailButton(): Locator {
		return this.emailNumberContainer
			.getByTestId("saveButton")
			.filter({ hasText: "Save" });
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

	public get usernameContainerV4(): Locator {
		return this.page.getByTestId(
			"profile-page-change-user-info-username-container",
		);
	}

	public get saveUsernameButtonV4(): Locator {
		return this.page.getByTestId("profile-page-change-user-info-save-username");
	}

	public get changeUsernameInputV4(): Locator {
		return this.getInputField("displayUsername", this.usernameContainerV4);
	}
}
