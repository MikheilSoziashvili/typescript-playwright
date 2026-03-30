import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";
import { parse_csv, toJson } from "@core/utils/utils";
import { AuthenticationAction } from "@enums/authentication-actions";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { MessageText } from "@enums/messages-texts";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";
import { isCI, users } from "configuration";
import { testData } from "test-data/test-data-manager";

test.describe("Login tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });
	testData()
		.fromCsvRaw({ file: CsvFilesName.LOGIN_NOT_POSSIBLE })
		.forEach((record) => {
			test(
				`[ENG-294] Login using username - Login is not possible: [Username: ${record.username}] [Password: ${record.password}]`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ homePage }) => {
					test.fixme(
						true,
						"Needs to be updated once XRay test is active",
					);
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
			testDetails()
				.withArbitraryAnnotations({
					type: AnnotationType.BUG,
					description:
						"Missing field-level validation for excessively long usernames",
				})
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE).apply(),
			async ({ homePage }) => {
				test.fixme(
					true,
					"Needs to be updated once XRay test is active",
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
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
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
				.withTags(TestTag.SMOKE, TestTag.ACCEPTANCE)
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
			.withTags(TestTag.SMOKE, TestTag.ACCEPTANCE)
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
		testDetails()
			.withTags(TestTag.PLATFORM_BUG, TestTag.ACCEPTANCE)
			.withJiraBugTickets("3177")
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ homePage, googleAuthPage }) => {
			test.fixme(isCI);
			await homePage.navigateAndCheckTitle();

			await homePage.unauthenticatedHeader.openLoginModal();
			await homePage.loginModal.clickGoogleButton();
			await googleAuthPage.loginToGoogle();

			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();
		},
	);

	Object.values(AuthenticationAction).forEach((method) => {
		test(
			`[ENG-4841] Verify social login options are visible from ${method} modal`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ homePage }) => {
				await homePage.navigateAndCheckTitle();

				await homePage.unauthenticatedHeader
					.steps()
					.verifySocialLoginOptionsVisible(method);
			},
		);
	});
});

test.describe(
	"Login tests - v4",
	testDetails().withTags(TestTag.V4, JiraComponent.LOGIN).apply(),
	() => {
		test(
			`[ENG-7849] Verify correct display of "Sign In" modal window`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ homePage, loginModal }) => {
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openLoginModalV4();
				await loginModal.assertThat().loginModalIsDisplayedV4();
				await loginModal.assertThat().loginModalElementsAreVisibleV4();
			},
		);

		for (const user of users) {
			test(
				`[ENG-7849] Login with username using different user types: [${toJson(
					user,
				)}]`,
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ homePage }) => {
					await homePage.navigateAndCheckTitle();

					await homePage.unauthenticatedHeader.openLoginModalV4();
					await homePage.loginModal.loginV4(
						user.username,
						user.password,
					);
					await homePage.assertThat().userIsLoggedInV4();
				},
			);
		}

		testData()
			.fromCsvRaw({ file: CsvFilesName.LOGIN_SUCCESSFUL })
			.forEach((user) => {
				test(
					`[ENG-7849] Login with ${user.username}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({ homePage }) => {
						await homePage.navigateAndCheckTitle();

						await homePage.unauthenticatedHeader.openLoginModalV4();
						await homePage.loginModal.loginV4(
							user.username,
							user.password,
						);

						await homePage.authenticatedHeader
							.assertThat()
							.loggedInUserElementsAreVisibleV4();
					},
				);
			});

		test(
			`[ENG-7856] Verify correct display of "Forgot Password " modal window`,
			testDetails()
				.withTags(
					JiraComponent.FORGOT_PASSWORD,
					JiraComponent.LOGIN_REGISTER, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({ homePage, loginModal }) => {
				const email =
					testData().fromPredefinedRandom().data.emails
						.forgotPassword;
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openLoginModalV4();
				await loginModal
					.steps()
					.sendForgotPasswordEmailSuccessfullyV4(
						email,
						MessageText.SUCCESSFULLY_SENT_EMAIL,
					);
				await loginModal.steps().closeForgotPasswordFormAndVerifyV4();
			},
		);

		test.describe("Verify username and password field validations on login modal", () => {
			testData()
				.fromCsvRaw({ file: CsvFilesName.LOGIN_REJECTED_V4 })
				.forEach((record) => {
					test(
						`[ENG-9836] Login rejected for [Username: ${record.username}] and [Password: ${record.password}]`,
						testDetails()
							.withAuthor(JiraUser.RALUCA_ARITON)
							.withTags(TestTag.ACCEPTANCE).apply(),
						async ({ homePage }) => {
							await homePage.navigateAndCheckTitle();
							await homePage.unauthenticatedHeader.openLoginModalV4();
							await homePage.loginModal.loginV4(
								record.username,
								record.password,
							);

							await homePage.loginModal
								.assertThat()
								.assertFailedLoginToastMessageV4();
						},
					);
				});

			testData()
				.fromCsvRaw({ file: CsvFilesName.LOGIN_INPUT_VALIDATION_V4 })
				.forEach((record) => {
					test(
						`[ENG-9836] Login input validation for [Username: ${record.username}] and [Password: ${record.password}]`,
						testDetails()
							.withAuthor(JiraUser.RALUCA_ARITON)
							.withTags(TestTag.ACCEPTANCE).apply(),
						async ({ homePage }) => {
							await homePage.navigateAndCheckTitle();
							await homePage.unauthenticatedHeader.openLoginModalV4();
							await homePage.loginModal.loginV4(
								record.username,
								record.password,
							);

							await homePage.loginModal
								.assertThat()
								.usernameFieldErrorTextIsV4(
									record.expected_username_warning,
								);

							await homePage.loginModal
								.assertThat()
								.passwordFieldErrorTextIsV4(
									record.expected_password_warning,
								);
						},
					);
				});
		});
	},
);
