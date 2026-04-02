import { BaseTestFlow, testFlow } from "@test-flows";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { generateEmailAndInbox } from "@core/utils/utils";
import { ProfilePage } from "@pages/profile/profile-page";
import { MailpitApi } from "@api/mailpit-api";
import { Page } from "@playwright/test";
import { ChangePasswordModal } from "@pages/modals/change-password-modal/change-password-modal";

export interface PasswordChangeSetupResult {
	userData: BrowserUserSession;
	userPassword: string;
}

export class PasswordChangeSetupTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Setup password change flow")
	public async setupPasswordChange(params: {
		browserSessionManager: BrowserSessionManager;
		profilePage: ProfilePage;
		mailpitApi: MailpitApi;
		page: Page;
		changePasswordModal: ChangePasswordModal;
	}): Promise<PasswordChangeSetupResult> {
		const {
			browserSessionManager,
			profilePage,
			mailpitApi,
			page,
			changePasswordModal,
		} = params;

		let emailDetails = generateEmailAndInbox();
		const userData = await browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{
				reuseContext: true,
				regularUserOptions: {
					email: emailDetails.email,
				},
			},
		);

		emailDetails = generateEmailAndInbox(
			userData.getAuthenticatedUser().user.email,
		);

		await profilePage.navigate();
		await profilePage.steps().clickChangePasswordButtonSuccessfully();

		await profilePage
			.steps()
			.verifyEmailAndProceedWithChangePassword(
				mailpitApi,
				emailDetails.email,
				page,
			);

		await changePasswordModal.assertThat().isModalDisplayed();

		return {
			userData: userData,
			userPassword: userData.getAuthenticatedUser().user.password,
		};
	}
}
