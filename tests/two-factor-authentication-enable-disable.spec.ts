import { testDetails } from "@core/helpers/test-details-helper";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generate2FACodeFromQRCodeImage,
	getUserDetailsByTestTitle,
} from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe("Two-Factor Authentication login verification", () => {
	let qrCode2FAImagePath: string;

	test.beforeEach(async () => {
		qrCode2FAImagePath = createPngImagePath();
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([qrCode2FAImagePath]);
	});

	test.use(storageStateNewUserDB());

	test(
		`[ENG-2539] - Enable and Disable Two-Factor Authentication`,
		testDetails()
			.withTags(JiraComponent.TWO_FA)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ homePage, profilePage, settingsPage }, testInfo) => {
			const newUserDetails = getUserDetailsByTestTitle(
				testInfo.title,
				testInfo.workerIndex,
			);
			await settingsPage.navigate();
			await settingsPage
				.steps()
				.enable2FaAuthentication(qrCode2FAImagePath);
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
			await settingsPage
				.steps()
				.disable2FaAuthentication(qrCode2FAImagePath);
			await profilePage.steps().logoutUserSuccessfully();
			await homePage.navigateAndCheckTitle();
			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.login(
				newUserDetails.username,
				newUserDetails.password,
			);
			await homePage.assertThat().userIsLoggedIn();
		},
	);
});
