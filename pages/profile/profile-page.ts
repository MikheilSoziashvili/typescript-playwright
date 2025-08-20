import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { BasePage } from "@base/base-page";
import { ProfilePageMap } from "./profile-page-map";
import { ProfilePageAsserter } from "./profile-page-asserter";
import { ContinueModal } from "@modals/continue-modal/continue-modal";
import { PROFILE_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { ProfilePageSteps } from "./profile-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { TwoFactorAuthModal } from "@pages/modals/two-factor-authentication-modal/two-factor-auth-modal";
import { UserMenuOption } from "@enums/user-menu-options";

export class ProfilePage extends BasePage<ProfilePageMap> {
	public constructor(page: Page) {
		super(page, new ProfilePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PROFILE_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): ProfilePageAsserter {
		return new ProfilePageAsserter(this);
	}

	public steps(): ProfilePageSteps {
		return new ProfilePageSteps(this);
	}

	public get continueModal(): ContinueModal {
		return new ContinueModal(this.page);
	}

	public get twoFactorAuthModal(): TwoFactorAuthModal {
		return new TwoFactorAuthModal(this.page);
	}

	@step("Logout")
	public async logout(): Promise<void> {
		await this.map.logOutButton.click();
		await this.continueModal.assertThat().isDisplayed();
		await this.continueModal.clickContinueButton();
		await this.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	}

	@step("Click save email")
	public async clickSaveEmail(): Promise<void> {
		await this.map.saveEmailButton.click();
	}

	@step("Click save phone")
	public async clickSavePhone(): Promise<void> {
		await this.map.savePhoneButton.click();
	}

	@step("Click save username")
	public async clickSaveUsername(): Promise<void> {
		await this.map.saveUsernameButton.click();
	}

	@step("Navigate to user menu option")
	public async navigateToUserMenuOption(
		menuItem: UserMenuOption,
	): Promise<void> {
		await this.map.userProfileLeftMenuItem(menuItem).click();
	}
}
