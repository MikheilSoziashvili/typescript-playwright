import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { parse_csv, toJson } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";
import { users } from "configuration";
import { testData } from "test-data/test-data-manager";

test.describe("Login tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });
	testData()
		.fromCsvRaw({ file: CsvFilesName.LOGIN_NOT_POSSIBLE })
		.forEach((record) => {
			test(
				`[ENG-294] Login using username - Login is not possible: [Username: ${record.username}] [Password: ${record.password}]`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ homePage }) => {
					await homePage.navigateAndCheckTitle();

					await homePage.unauthenticatedHeader.openLoginModal();
					await homePage.loginModal.fillInCredentials(
						record.username,
						record.password,
					);

					await homePage.loginModal
						.assertThat(true)
						.usernameFieldErrorTooltipIs(
							record.expected_username_warning,
						);

					await homePage.loginModal
						.assertThat(true)
						.passwordFieldErrorTooltipIs(
							record.expected_password_warning,
						);

					// Temporary solution. Previously button was disabled until inputs are correct, now it is not. Discussed with Johannes (To be aligned)
					// await homePage.loginModal.assertThat().loginBtnIsDisabled();
				},
			);
		});

	for (const record of parse_csv(
		DATASETS_DIR,
		CsvFilesName.LOGIN_REJECTED,
	) as {
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

		test(
			`[ENG-294] Login using username - Login is rejected: [Username: ${record.username}] [Password: ${record.password}]`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ homePage }) => {
				test.fixme(
					record.username ===
						"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
					"Fix when bug [ENG-2397] is fixed",
				);
				await homePage.navigateAndCheckTitle();

				await homePage.unauthenticatedHeader.openLoginModal();
				await homePage.loginModal.login(
					record.username,
					record.password,
				);

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
			},
		);
	}

	for (const user of users) {
		test(
			`[ENG-295] Login with username using different user types: [${toJson(
				user,
			)}]`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ homePage }) => {
				await homePage.navigateAndCheckTitle();

				await homePage.unauthenticatedHeader.openLoginModal();
				await homePage.loginModal.login(user.username, user.password);
				await homePage.assertThat().userIsLoggedIn();
			},
		);
	}

	for (const user of parse_csv(
		DATASETS_DIR,
		CsvFilesName.LOGIN_SUCCESSFUL,
	) as {
		username: string;
		password: string;
	}[]) {
		test(
			`[ENG-1070] Login with ${user.username}`,
			testDetails()
				.withTags(TestTag.SMOKE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ homePage }) => {
				await homePage.navigateAndCheckTitle();

				await homePage.unauthenticatedHeader.openLoginModal();
				await homePage.loginModal.login(user.username, user.password);

				await homePage.authenticatedHeader
					.assertThat()
					.loggedInUserElementsAreVisible();
			},
		);
	}

	test(
		"[ENG-292] Login with steam user",
		testDetails()
			.withTags(TestTag.SMOKE)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ homePage, steamAuthPage, steamBlockedPage }) => {
			await homePage.navigateAndCheckTitle();

			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.clickSteamButton();
			await steamAuthPage.loginToSteam();
			await steamBlockedPage.continueAndSignIn();

			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();
		},
	);

	test(
		"[ENG-2722] Login with Google user through Google auth portal",
		testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
		async ({ homePage, googleAuthPage }) => {
			test.fixme(
				!!process.env.CI,
				"ENG-3177 Additional captcha input field for text from picture is added for Google auth",
			);
			await homePage.navigateAndCheckTitle();

			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.clickGoogleButton();
			await googleAuthPage.loginToGoogle();

			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();
		},
	);
});
