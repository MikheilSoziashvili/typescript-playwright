import { BaseTestFlow, testFlow } from "@test-flows";
import { UserTags } from "@enums/db/user-tags";
import { UserClasses } from "@enums/db/user-classes";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { GamdomApiDbFacade } from "@core/facades/gamdom-api-db/gamdom-api-db-facade";

export interface StaffUserSetupResult {
	staffSession: BrowserUserSession;
	regularUsername: string;
	regularPassword: string;
	regularEmail: string;
}

export class UserInfoStaffUserSetupFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Setup staff user, regular user, and navigate to Edit Info page")
	public async setupStaffUserAndNavigateToEditInfo(params: {
		browserSessionManager: BrowserSessionManager;
		gamdomApiDbFacade: GamdomApiDbFacade;
		staffTag: UserTags;
	}): Promise<StaffUserSetupResult> {
		const { browserSessionManager, gamdomApiDbFacade, staffTag } = params;

		this.log(
			`Creating staff user with tag: ${staffTag} and authenticating`,
		);

		const staffSession = await browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{
				reuseContext: true,
				regularUserOptions: {
					tags: staffTag,
					userClass: UserClasses.Admin,
					emailVerified: true,
					useGamdomEmailDomain: true,
				},
			},
		);

		this.log("Staff user authenticated successfully");

		const [regularUser] = await gamdomApiDbFacade.createUsersDb({
			usersCount: 1,
			emailVerified: true,
		});

		this.log(`Regular user created: ${regularUser.username}`);

		this.log(
			`Navigating to User Info page for user: ${regularUser.username}`,
		);
		await staffSession.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(regularUser.username);

		this.log("Clicking Edit Info tab");
		await staffSession.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.EditInfo,
		);

		this.log("Navigation to Edit Info page completed");

		return {
			staffSession: staffSession,
			regularUsername: regularUser.username,
			regularPassword: regularUser.password,
			regularEmail: regularUser.email,
		};
	}
}
