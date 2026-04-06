import { testDetails } from "@core/helpers/test-details-helper";
import { toJson } from "@core/utils/utils";
import { AuthenticationAction } from "@enums/authentication-actions";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { MessageText } from "@enums/messages-texts";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";
import { isCI, users } from "configuration";
import { testData } from "test-data/test-data-manager";

test.describe(
	"Login tests",
	testDetails().withTags(JiraComponent.LOGIN).apply(),
	() => {
		test(
			`[ENG-7849] Verify correct display of "Sign In" modal window`,
			testDetails()
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({ homePage, loginModal }) => {
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openLoginModal();
				await loginModal.assertThat().loginModalIsDisplayed();
				await loginModal.assertThat().loginModalElementsAreVisible();
			},
		);

		for (const user of users) {
			test(
				`[ENG-7849] Login with username using different user types: [${toJson(
					user,
				)}]`,
				testDetails()
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.withTags(TestTag.ACCEPTANCE)
					.apply(),
				async ({ homePage }) => {
					await homePage.navigateAndCheckTitle();

					await homePage.unauthenticatedHeader.openLoginModal();
					await homePage.loginModal.login(
						user.username,
						user.password,
					);
					await homePage.assertThat().userIsLoggedIn();
				},
			);
		}

		testData()
			.fromCsvRaw({ file: CsvFilesName.LOGIN_SUCCESSFUL })
			.forEach((user) => {
				test(
					`[ENG-7849] Login with ${user.username}`,
					testDetails()
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.withTags(TestTag.ACCEPTANCE)
						.apply(),
					async ({ homePage }) => {
						await homePage.navigateAndCheckTitle();

						await homePage.unauthenticatedHeader.openLoginModal();
						await homePage.loginModal.login(
							user.username,
							user.password,
						);

						await homePage.authenticatedHeader
							.assertThat()
							.loggedInUserElementsAreVisible();
					},
				);
			});

		test(
			`[ENG-7856] Verify correct display of "Forgot Password " modal window`,
			testDetails()
				.withTags(
					JiraComponent.FORGOT_PASSWORD,
					JiraComponent.LOGIN_REGISTER,
					TestTag.ACCEPTANCE,
				)
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({ homePage, loginModal }) => {
				const email =
					testData().fromPredefinedRandom().data.emails
						.forgotPassword;
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openLoginModal();
				await loginModal
					.steps()
					.sendForgotPasswordEmailSuccessfully(
						email,
						MessageText.SUCCESSFULLY_SENT_EMAIL,
					);
				await loginModal.steps().closeForgotPasswordFormAndVerify();
			},
		);

		test.describe("Verify username and password field validations on login modal", () => {
			testData()
				.fromCsvRaw({ file: CsvFilesName.LOGIN_REJECTED })
				.forEach((record) => {
					test(
						`[ENG-9836] Login rejected for [Username: ${record.username}] and [Password: ${record.password}]`,
						testDetails()
							.withAuthor(JiraUser.RALUCA_ARITON)
							.withTags(TestTag.ACCEPTANCE)
							.apply(),
						async ({ homePage }) => {
							await homePage.navigateAndCheckTitle();
							await homePage.unauthenticatedHeader.openLoginModal();
							await homePage.loginModal.login(
								record.username,
								record.password,
							);

							await homePage.loginModal
								.assertThat()
								.assertFailedLoginToastMessage();
						},
					);
				});

			testData()
				.fromCsvRaw({ file: CsvFilesName.LOGIN_INPUT_VALIDATION })
				.forEach((record) => {
					test(
						`[ENG-9836] Login input validation for [Username: ${record.username}] and [Password: ${record.password}]`,
						testDetails()
							.withAuthor(JiraUser.RALUCA_ARITON)
							.withTags(TestTag.ACCEPTANCE)
							.apply(),
						async ({ homePage }) => {
							await homePage.navigateAndCheckTitle();
							await homePage.unauthenticatedHeader.openLoginModal();
							await homePage.loginModal.login(
								record.username,
								record.password,
							);

							await homePage.loginModal
								.assertThat()
								.usernameFieldErrorTextIs(
									record.expected_username_warning,
								);

							await homePage.loginModal
								.assertThat()
								.passwordFieldErrorTextIs(
									record.expected_password_warning,
								);
						},
					);
				});
		});

		test(
			"[ENG-292] [ENG-9840] Login with steam user",
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
				testDetails()
					.withAuthor(JiraUser.NIKOLAY_GENOV)
					.withTags(TestTag.ACCEPTANCE)
					.apply(),
				async ({ homePage }) => {
					await homePage.navigateAndCheckTitle();

					await homePage.unauthenticatedHeader
						.steps()
						.verifySocialLoginOptionsVisible(method);
				},
			);
		});
	},
);
