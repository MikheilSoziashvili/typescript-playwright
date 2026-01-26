import { MAILINATOR_DOMAIN } from "@constants/domains";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	generateEmailAndInbox,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { faker } from "@faker-js/faker";
import { passwordPattern } from "@support/regex-patterns";
import { test } from "fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe("Password reset", () => {
	test(
		"[ENG-1119] Password reset",
		testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
		async ({
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

			await toast
				.assertThat()
				.toastMessageIs(
					ToastTitle.SUCCESS,
					ToastSubTitle.PASSWORD_CHANGED,
				);

			await homePage.navigateAndCheckTitle();
			await homePage.steps().loginUser(user.username, newUserPassword);
		},
	);
});

test.describe("Password reset - v4", () => {
	test.slow();
	test(
		"[ENG-9510] Password reset - v4",
		testDetails()
			.withTags(TestTag.V4, JiraComponent.PASSWORD_RESET)
			.withAuthor(JiraUser.RALUCA_ARITON)
			.apply(),
		async ({ browserSessionManager, mailinatorApi, page }) => {
			let emailDetails = generateEmailAndInbox();

			const newUserPassword = testData()
				.fromRandom()
				.data.password.password();

			const regularUser = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
				{ reuseContext: true, regularUserOptions: emailDetails },
			);

			emailDetails = generateEmailAndInbox(
				regularUser.getAuthenticatedUser().user.email,
			);

			await regularUser.pages.profilePage
				.steps()
				.logoutUserSuccessfullyV4();
			await regularUser.pages.homePage.navigateAndCheckTitle();
			await regularUser.pages.homePage.unauthenticatedHeader.openLoginModalV4();
			await regularUser.pages.homePage
				.steps()
				.resetPasswordV4(regularUser.getAuthenticatedUser().user.email);
			await regularUser.pages.homePage
				.steps()
				.changePasswordFromEmailV4(
					newUserPassword,
					mailinatorApi,
					MAILINATOR_DOMAIN,
					emailDetails.inbox,
					page,
					{ messageIndex: 1 },
					"Password Reset",
				);

			await regularUser.pages.toastV4
				.assertThat()
				.toastMessageIsV4(
					ToastTitle.SUCCESS_V4,
					ToastSubTitle.PASSWORD_CHANGED,
				);

			await regularUser.pages.homePage.navigateAndCheckTitle();
			await regularUser.pages.homePage
				.steps()
				.loginUserV4(
					regularUser.getAuthenticatedUser().user.username,
					newUserPassword,
				);
		},
	);
});
