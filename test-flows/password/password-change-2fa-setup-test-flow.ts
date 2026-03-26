import { BaseTestFlow, testFlow } from "@test-flows";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { ProfilePage } from "@pages/profile/profile-page";
import { ChangePasswordModal } from "@pages/modals/change-password-modal/change-password-modal";
import { SettingsPage } from "@pages/settings/settings-page";
import { generate2FACodeFromQRCodeImage } from "@core/utils/utils";

export interface PasswordChange2FaSetupResult {
	userData: BrowserUserSession;
	userPassword: string;
}

export class PasswordChange2FaSetupTestFlow extends BaseTestFlow {
	constructor(
		private readonly browserSessionManager: BrowserSessionManager,
	) {
		super();
	}

	@testFlow("Setup 2FA password change flow")
	public async setup2FaPasswordChange(params: {
		profilePage: ProfilePage;
		settingsPage: SettingsPage;
		changePasswordModal: ChangePasswordModal;
		qrCode2FAImagePath: string;
	}): Promise<PasswordChange2FaSetupResult> {
		const {
			profilePage,
			settingsPage,
			changePasswordModal,
			qrCode2FAImagePath,
		} = params;

		const userData = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{ reuseContext: true },
		);

		await settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);

		await profilePage.navigate();
		await profilePage.clickChangePasswordButton();

		const code2FA =
			await generate2FACodeFromQRCodeImage(qrCode2FAImagePath);
		await profilePage.twoFactorAuthModal
			.steps()
			.enter2FaCodeSuccessfully(code2FA);

		await changePasswordModal.assertThat().isModalDisplayed();

		return {
			userData: userData,
			userPassword: userData.getAuthenticatedUser().user.password,
		};
	}
}
