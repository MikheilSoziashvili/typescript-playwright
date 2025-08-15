import { MAILINATOR_DOMAIN } from "@constants/domains";
import {
	generateEmailAndInbox,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { faker } from "@faker-js/faker";
import { passwordPattern } from "@support/regex-patterns";
import { test } from "fixtures/fixtures";

test.describe("Password reset", () => {
	test("[ENG-1119] Password reset", async ({
		gamdomApiDbFacade,
		homePage,
		profilePage,
		mailinatorApi,
		page,
		toast,
	}) => {
		let emailDetails = generateEmailAndInbox();
		const newUserPassword = faker.internet.password({
			length: 15,
			pattern: passwordPattern,
		});

		const { user, cookie } =
			await gamdomApiDbFacade.createSingleUserDbAndAuth({
				email: emailDetails.email,
			});

		emailDetails = generateEmailAndInbox(user.email);
		await setAuthenticationCookies(page, cookie);

		await profilePage.steps().logoutUserSuccessfully();
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openLoginModal();
		await homePage.steps().resetPassword(user.email);
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
		await homePage.steps().loginUser(user.username, newUserPassword);
	});
});
