import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { getCurrentDate } from "@core/utils/utils";

export class BanUnbanUserTestFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Ban user via admin UI")
	public async banUser(banReason: string): Promise<{
		adminSession: BrowserUserSession;
		regularUser: BrowserUserSession;
	}> {
		const adminSession = await this.browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);

		const regularUser = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
		);

		const targetUser = regularUser.getAuthenticatedUser().user;

		await adminSession.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUser.username);

		await adminSession.pages.infoAdminPage
			.steps()
			.banUser({ reason: banReason });

		return { adminSession, regularUser };
	}

	@testFlow("Verify user sees banned page after login")
	public async verifyUserIsBanned(
		regularUser: BrowserUserSession,
		banReason: string,
	): Promise<void> {
		const { username, password } = regularUser.getAuthenticatedUser().user;

		await regularUser.pages.homePage.navigate();
		await regularUser.pages.homePage
			.steps()
			.loginUser(username, password, { expectErrors: true });

		await regularUser.pages.bannedUserPage.waitRedContainerToBeVisible();
		await regularUser.pages.bannedUserPage
			.assertThat()
			.isBannedTitleDisplayed();
		await regularUser.pages.bannedUserPage
			.assertThat()
			.isBannedReasonDisplayed(`${banReason} - ${getCurrentDate()}`);
	}

	@testFlow("Unban user via admin UI and verify login")
	public async unbanAndVerifyLogin(
		adminSession: BrowserUserSession,
		regularUser: BrowserUserSession,
	): Promise<void> {
		await adminSession.pages.infoAdminPage.steps().unbanUser();

		const { username, password } = regularUser.getAuthenticatedUser().user;

		await regularUser.pages.homePage.navigate();
		await regularUser.pages.homePage.steps().loginUser(username, password);

		await regularUser.pages.homePage.assertThat().userIsLoggedIn();
	}

	@testFlow("Execute full ban and unban user scenario")
	public async runBanAndUnbanFlow(banReason: string): Promise<void> {
		const { adminSession, regularUser } = await this.banUser(banReason);
		await this.verifyUserIsBanned(regularUser, banReason);
		await this.unbanAndVerifyLogin(adminSession, regularUser);
	}
}
