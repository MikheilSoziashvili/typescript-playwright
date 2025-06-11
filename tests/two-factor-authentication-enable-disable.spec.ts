import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generate2FACodeFromQRCodeImage,
	getUserDetailsByTestTitle,
} from "@core/utils/utils";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { BrowserName } from "@enums/playwright/project-browser-names";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Two-Factor Authentication login verification", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async ({}, testInfo) => {
		if (testInfo.project.name === BrowserName.FIREFOX) {
			testInfo.annotations.push({
				type: AnnotationType.BROWSER_SPECIFIC,
				description:
					"Known Firefox issue: click actions may not register reliably",
			});
		}
		qrCode2FAImagePath = createPngImagePath();
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewUserDB());

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
