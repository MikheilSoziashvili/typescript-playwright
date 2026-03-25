import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { BanReason } from "@enums/ban-reasons";
import { getCookieHeader, getCurrentDate } from "@core/utils/utils";

export class HardBanImmediateAccountLockTestFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Ban user via API with given reason")
	public async banUser(reason: BanReason): Promise<{
		adminSession: BrowserUserSession;
		regularUser: BrowserUserSession;
	}> {
		const adminSession = await this.browserSessionManager.loginAs(
			TestUserRole.ADMIN_USER_INFO_ADMIN,
			{ reuseContext: true },
		);

		const adminCookie = getCookieHeader(
			adminSession.getAuthenticatedUser().cookie,
		);

		const regularUser = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
		);

		await regularUser.pages.homePage.navigate();

		const { userId } = regularUser.getAuthenticatedUser().user;

		await (
			await adminSession.apis.gamdomApi
		).banUser(userId, reason, { Cookie: adminCookie });

		return { adminSession, regularUser };
	}

	@testFlow("Verify user is logged out after ban")
	public async verifyUserIsLoggedOut(
		regularUser: BrowserUserSession,
	): Promise<void> {
		await regularUser.pages.homePage.assertThat().userIsLoggedOut();
	}

	@testFlow("Login with banned user and verify banned page")
	public async verifyBannedPageAfterLogin(
		regularUser: BrowserUserSession,
		reason: string,
	): Promise<void> {
		const { username, password } = regularUser.getAuthenticatedUser().user;

		await regularUser.pages.homePage
			.steps()
			.loginUser(username, password, { expectErrors: true });

		await regularUser.pages.bannedUserPage
			.steps()
			.verifyBannedPageWithReason(`${reason} - ${getCurrentDate()}`);
	}

	@testFlow("Execute full hard ban immediate account lock scenario")
	public async runHardBanImmediateLockFlow(reason: BanReason): Promise<void> {
		const { regularUser } = await this.banUser(reason);
		await this.verifyUserIsLoggedOut(regularUser);
		await this.verifyBannedPageAfterLogin(regularUser, reason);
	}
}
