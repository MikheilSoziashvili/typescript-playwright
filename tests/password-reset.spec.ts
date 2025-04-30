import { MAILINATOR_DOMAIN } from "@constants/domains";
import { generateEmailAndInbox } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { faker } from "@faker-js/faker";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { passwordPattern } from "@support/regex-patterns";
import { test } from "fixtures/fixtures";

test.describe("Password reset", () => {
	const emailDetails = generateEmailAndInbox();
	const userDetails = new RegisterTestData();
	const newUserPassword = faker.internet.password({
		length: 15,
		pattern: passwordPattern,
	});

	test.use(
		storageStateNewUserDB({
			username: userDetails.username,
			password: userDetails.password,
			email: emailDetails.email,
		}),
	);
	test("[ENG-1119] Password reset", async ({
		homePage,
		profilePage,
		mailinatorApi,
		page,
		toast,
	}) => {
		await profilePage
			.steps()
			.verifyEmail(
				mailinatorApi,
				MAILINATOR_DOMAIN,
				emailDetails.inbox,
				page,
			);
		await profilePage.steps().logoutUserSuccessfully();
		await homePage.navigateAndCheckTitle();

		await homePage.unauthenticatedHeader.openLoginModal();
		await homePage.steps().resetPassword(emailDetails.email);
		await homePage
			.steps()
			.changePasswordFromEmail(
				newUserPassword,
				mailinatorApi,
				MAILINATOR_DOMAIN,
				emailDetails.inbox,
				page,
				{ messageIndex: 1 },
				"Password Reset",
			);

		await toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await toast.assertThat().subTitleIs(ToastSubTitle.PASSWORD_CHANGED);

		await homePage.navigateAndCheckTitle();
		await homePage.steps().loginUser(userDetails.username, newUserPassword);
	});
});
