import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generate2FACodeFromQRCodeImage,
	getUserDetailsByTestTitle,
} from "@core/utils/utils";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Two-Factor Authentication login verification", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async () => {
		qrCode2FAImagePath = createPngImagePath();
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewUserAPI());

	test(`[ENG-2539] - Enable and Disable Two-Factor Authentication`, async ({
		homePage,
		profilePage,
		settingsPage,
	}, testInfo) => {
		const newUserDetails = getUserDetailsByTestTitle(
			testInfo.title,
			testInfo.workerIndex,
		);
		await settingsPage.navigate();
		await settingsPage.steps().enable2FaAuthentication(qrCode2FAImagePath);
		await profilePage.steps().logoutUserSuccessfully();
		const code2FA = await generate2FACodeFromQRCodeImage(
			qrCode2FAImagePath,
		);
		await homePage
			.steps()
			.loginUserWith2FaCodeSuccessfully(
				newUserDetails.username,
				newUserDetails.password,
				code2FA,
			);

		await settingsPage.navigate();
		await settingsPage.steps().disable2FaAuthentication(qrCode2FAImagePath);
		await profilePage.steps().logoutUserSuccessfully();
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openLoginModal();
		await homePage.loginModal.login(
			newUserDetails.username,
			newUserDetails.password,
		);
		await homePage.assertThat().userIsLoggedIn();
	});
});
