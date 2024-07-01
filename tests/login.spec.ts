import { users } from "configuration";
import { test } from "@fixtures/fixtures";
import { parse_csv, toJson } from "@core/utils";
import { DATASETS_DIR } from "@constants/file-paths";

const LOGIN_NOT_POSSIBLE_CSV = "ENG-294-login-not-possible.csv";
const LOGIN_REJECTED_CSV = "ENG-294-login-rejected.csv";
const LOGIN_SUCCESSFUL_CSV = "ENG-1070-login-successful.csv";

test.describe("Login tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });
	for (const record of parse_csv(DATASETS_DIR, LOGIN_NOT_POSSIBLE_CSV) as {
		username: string;
		password: string;
		expected_username_warning: string;
		expected_password_warning: string;
	}[]) {
		test(`[ENG-294] Login using username - Login is not possible: [Username: ${record.username}] [Password: ${record.password}]`, async ({
			homePage,
		}) => {
			await homePage.navigateAndCheckTitle();

			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.fillInCredentials(
				record.username,
				record.password,
			);

			await homePage.loginModal
				.assertThat(true)
				.usernameFieldErrorTooltipIs(record.expected_username_warning);

			await homePage.loginModal
				.assertThat(true)
				.passwordFieldErrorTooltipIs(record.expected_password_warning);

			// Temporary solution. Previously button was disabled until inputs are correct, now it is not. Discussed with Johannes (To be aligned)
			// await homePage.loginModal.assertThat().loginBtnIsDisabled();
		});
	}

	for (const record of parse_csv(DATASETS_DIR, LOGIN_REJECTED_CSV) as {
		username: string;
		password: string;
		expected_feedback_location: string;
		expected_feedback_warning: string;
	}[]) {
		const expected_feedback_warning_username =
			record.expected_feedback_location.includes("username")
				? record.expected_feedback_warning
				: "";
		const expected_feedback_warning_password =
			record.expected_feedback_location.includes("password")
				? record.expected_feedback_warning
				: "";
		const expected_feedback_warning_toast =
			record.expected_feedback_location.includes("toast")
				? record.expected_feedback_warning
				: "";

		test(`[ENG-294] Login using username - Login is rejected: [Username: ${record.username}] [Password: ${record.password}]`, async ({
			homePage,
		}) => {
			await homePage.navigateAndCheckTitle();

			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.login(record.username, record.password);

			await homePage.loginModal
				.assertThat(true)
				.usernameFieldErrorTooltipIs(
					expected_feedback_warning_username,
				);

			await homePage.loginModal
				.assertThat(true)
				.passwordFieldErrorTooltipIs(
					expected_feedback_warning_password,
				);

			await homePage
				.assertThat(true)
				.toastMessageContainsText(expected_feedback_warning_toast);
		});
	}

	for (const user of users) {
		test(`[ENG-295] Login with username using different user types: [${toJson(
			user,
		)}]`, async ({ homePage }) => {
			await homePage.navigateAndCheckTitle();

			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.login(user.username, user.password);
			await homePage.assertThat().userIsLoggedIn();
		});
	}

	for (const user of parse_csv(DATASETS_DIR, LOGIN_SUCCESSFUL_CSV) as {
		username: string;
		password: string;
	}[]) {
		test(`[ENG-1070] Login with ${user.username} @smoke`, async ({
			homePage,
		}) => {
			await homePage.navigateAndCheckTitle();

			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.login(user.username, user.password);

			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();
		});
	}

	test("[ENG-292] Login with steam user @smoke", async ({
		homePage,
		steamAuthPage,
		steamBlockedPage,
	}) => {
		await homePage.navigateAndCheckTitle();

		await homePage.unauthenticatedHeader.openLoginModal();
		await homePage.loginModal.clickSteamButton();
		await steamAuthPage.loginToSteam();
		await steamBlockedPage.continueAndSignIn();

		await homePage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();
	});
});
