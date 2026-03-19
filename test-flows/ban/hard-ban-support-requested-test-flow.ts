import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { BanReason } from "@enums/ban-reasons";
import { getCookieHeader } from "@core/utils/utils";

export class HardBanSupportRequestedTestFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Ban user via API with Support Requested reason")
	public async banUser(): Promise<{
		adminSession: BrowserUserSession;
		bannedUser: BrowserUserSession;
	}> {
		const adminSession = await this.browserSessionManager.loginAs(
			TestUserRole.ADMIN_USER_INFO_ADMIN,
			{ reuseContext: true },
		);
		const adminCookie = getCookieHeader(
			adminSession.getAuthenticatedUser().cookie,
		);

		const bannedUser = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
		);
		const { userId } = bannedUser.getAuthenticatedUser().user;

		await (
			await adminSession.apis.gamdomApi
		).banUser(userId, BanReason.SUPPORT_REQUESTED, {
			Cookie: adminCookie,
		});

		this.log(`User ${userId} banned with Support Requested reason`);

		return { adminSession, bannedUser };
	}

	@testFlow("Verify banned user has restricted access")
	public async verifyRestrictedAccess(
		bannedUser: BrowserUserSession,
	): Promise<void> {
		// Verify banned banner on home page
		await bannedUser.pages.homePage.navigate();
		await bannedUser.pages.homePage
			.assertThat()
			.isTopBannedBannerDisplayedWithText();

		// Verify Rewards: 3 rakeback cards visible, no promo banners
		await bannedUser.pages.rewardsPage
			.steps()
			.navigateAndVerifyBannedUserRewardsView();

		// Verify Wallet: only Withdraw and Vault tabs (no Deposit)
		await bannedUser.pages.homePage.navigate();
		await bannedUser.pages.homePage.clickWalletButton();
		await bannedUser.pages.walletModal
			.assertThat()
			.onlyWithdrawAndVaultTabsAreVisible();

		// Verify Support gateway is accessible
		await bannedUser.pages.supportPage.steps().navigateAndVerifyVisible();

		// Verify chat input is disabled
		await bannedUser.pages.homePage.authenticatedHeader.expandChatIfNotVisible();
		await bannedUser.pages.chat
			.assertThat()
			.chatInputIsDisabledForBannedUser();
	}

	@testFlow("Execute full hard ban Support Requested scenario")
	public async execute(): Promise<void> {
		const { bannedUser } = await this.banUser();
		await this.verifyRestrictedAccess(bannedUser);
	}
}
