import { BaseTestFlow, testFlow } from "@test-flows";
import { UserMenuOption } from "@enums/user-menu-options";
import { SteamUserLoginLogoutParams } from "./types/ban-flow-types";

export class SteamUserLoginLogoutFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Steam user login, verify, and logout")
	public async loginAndLogout(
		params: SteamUserLoginLogoutParams,
	): Promise<void> {
		const {
			gamdomDb,
			homePage,
			steamAuthPage,
			steamBlockedPage,
			profilePage,
			usernameSteam,
			bannedUsername,
			password,
		} = params;

		await gamdomDb.deleteUserByUsername(usernameSteam);
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openLoginModal();
		await homePage.loginModal.clickSteamButton();
		await steamAuthPage.loginToSteam(bannedUsername, password);
		await steamBlockedPage.continueAndSignIn();
		await homePage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
		await homePage.authenticatedHeader.navigateToUserMenuOption(
			UserMenuOption.PROFILE,
		);
		await profilePage.logout();
	}
}
