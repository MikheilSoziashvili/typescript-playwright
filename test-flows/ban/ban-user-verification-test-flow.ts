import { BaseTestFlow, testFlow } from "@test-flows";
import { TestUserRole } from "@enums/test-user-roles";
import { getCookieHeader } from "@core/utils/utils";
import { BanUserVerificationParams } from "./types/ban-flow-types";

export class BanUserVerificationFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Ban user via admin API and verify banned banner")
	public async banUserAndVerifyBanner(
		params: BanUserVerificationParams,
	): Promise<void> {
		const {
			gamdomDb,
			browserSessionManager,
			gamdomApi,
			homePage,
			steamBlockedPage,
			usernameSteam,
			banReason,
		} = params;
		const userId = await gamdomDb.getUserIdByUsername(usernameSteam);
		const superAdmin = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
		);

		const superAdminCookie = getCookieHeader(
			superAdmin.getAuthenticatedUser().cookie,
		);
		await gamdomApi.banUser(userId, banReason, {
			Cookie: superAdminCookie,
		});
		await homePage.navigate();
		await homePage.unauthenticatedHeader.openLoginModal();
		await homePage.loginModal.clickSteamButton();
		await steamBlockedPage.continueAndSignIn();
		await homePage.assertThat().isTopBannedBannerDisplayedWithText();
	}
}
