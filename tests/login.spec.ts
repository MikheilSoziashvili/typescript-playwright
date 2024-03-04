import { users } from "../configuration";
import { test } from "../fixtures/fixtures";
import { parse_csv, toJson } from "../core/utils";

test.describe.skip('Login tests', () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	for (const record of parse_csv("datasets", "QA-5-login-not-possible.csv") as {
		username: string;
		password: string;
		expected_username_warning: string;
		expected_password_warning: string;
	}[]) {
		test(`[QA-5] Login using username - Login is not possible: [Username: ${record.username}] [Password: ${record.password}]`, async ({
			homePage,
		}) => {
			await homePage.navigateAndCheckTitle();

			await homePage.openLoginModal();
			await homePage.loginModal.fillInCredentials(
				record.username,
				record.password,
			);

			if (record.expected_username_warning) {
				await homePage.loginModal
					.assertThat()
					.usernameFieldErrorTooltipIs(record.expected_username_warning);
			}

			if (record.expected_password_warning) {
				await homePage.loginModal
					.assertThat()
					.passwordFieldErrorTooltipIs(record.expected_password_warning);
			}

			await homePage.loginModal.assertThat().loginBtnIsDisabled();
		});
	}

	for (const record of parse_csv("datasets", "QA-5-login-rejected.csv") as {
		username: string;
		password: string;
		expected_feedback_location: string;
		expected_feedback_warning: string;
	}[]) {
		test(`[QA-5] Login using username - Login is rejected: [Username: ${record.username}] [Password: ${record.password}]`, async ({
			homePage,
		}) => {
			await homePage.navigateAndCheckTitle();

			await homePage.openLoginModal();
			await homePage.loginModal.login(record.username, record.password);

			if (record.expected_feedback_location.includes("username")) {
				await homePage.loginModal
					.assertThat()
					.usernameFieldErrorTooltipIs(record.expected_feedback_warning);
			}

			if (record.expected_feedback_location.includes("password")) {
				await homePage.loginModal
					.assertThat()
					.passwordFieldErrorTooltipIs(record.expected_feedback_warning);
			}

			if (record.expected_feedback_location.includes("toast")) {
				await homePage
					.assertThat()
					.toastMessageContainsText(record.expected_feedback_warning);
			}
		});
	}

	for (const user of users) {
		test(`[QA-54] Login with username using different user types: [${toJson(
			user,
		)}]`, async ({ homePage }) => {
			await homePage.navigateAndCheckTitle();

			await homePage.openLoginModal();
			await homePage.loginModal.login(user.username, user.password);
			await homePage.assertThat().userIsLoggedIn();
		});
	}

});
