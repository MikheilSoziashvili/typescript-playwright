import {
	generateEmailAndInbox,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { test } from "fixtures/fixtures";
import { RegisterTestData } from "@dtos/test-data";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestUserRole } from "@enums/test-user-roles";
import { testData } from "test-data/test-data-manager";
import { JiraComponent } from "@enums/jira/jira-components";
import { isScheduledRun } from "configuration";
import { TestTag } from "@enums/test-tags";

test.describe("Email Verification Tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	const userWalletTestDataDomain = testData().fromDomain().userWallet;

	test(
		"[ENG-1133] E-mail verification - new account",
		testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
		async ({ mailpitApi, page, profilePage, gamdomApi }) => {
			let { email } = generateEmailAndInbox();
			const userData = new RegisterTestData({ email });

			const cookie = await gamdomApi.authenticateWithNewUser(userData);
			await setAuthenticationCookies(page, cookie);

			({ email } = generateEmailAndInbox(userData.email));

			await profilePage
				.steps()
				.verifyEmailAndCheckProfile(
					mailpitApi,
					email,
					page,
				);
		},
	);

	test(
		"[ENG-1121] E-mail verification",
		testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
		async ({ mailpitApi, page, profilePage, gamdomApi }) => {
			let { email } = generateEmailAndInbox();
			const userData = new RegisterTestData({ email });

			const cookie = await gamdomApi.authenticateWithNewUser(userData);
			await setAuthenticationCookies(page, cookie);

			({ email } = generateEmailAndInbox(userData.email));

			await profilePage.navigate();
			await profilePage.steps().completeVerificationFlow();

			await profilePage
				.steps()
				.verifyEmailAndCheckProfile(
					mailpitApi,
					email,
					page,
					{ messageIndex: 2 },
				);
		},
	);

	test(
		"[ENG-1132] E-mail verification - changing e-mail",
		testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
		async ({ gamdomApiDbFacade, mailpitApi, page, profilePage }) => {
			const { email } = generateEmailAndInbox();
			const newEmailData = generateEmailAndInbox();

			const { cookie } =
				await gamdomApiDbFacade.createSingleUserDbAndAuth({
					email: email,
				});

			await setAuthenticationCookies(page, cookie);

			await profilePage.navigate();
			await profilePage
				.steps()
				.changeEmailSuccessfully(newEmailData.email);

			await profilePage
				.steps()
				.verifyEmailAndCheckProfile(
					mailpitApi,
					newEmailData.email,
					page,
				);
		},
	);

	test(
		`[ENG-7516] [Wallet] Verify e-mail verification restriction on Withdraw tab`,
		testDetails()
			.withTags(JiraComponent.WALLET, JiraComponent.WITHDRAWAL, TestTag.ACCEPTANCE)
			.withJiraBugTickets("ENG-13989")
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ browserSessionManager, mailpitApi, testDataRandom }) => {
			test.fixme(isScheduledRun);
			const { email: userEmail } = testDataRandom.data.mailpit.emailInbox();
			const regularUserEmailNotVerified =
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
					regularUserOptions: {
						emailVerified: false,
						email: userEmail,
					},
				});

			await regularUserEmailNotVerified.pages.homePage.navigateToWallet();
			await regularUserEmailNotVerified.pages.walletModal.openWithdrawTab();

			await regularUserEmailNotVerified.pages.walletModal
				.steps()
				.verifyWithdrawCryptoEmailNotVerifiedMessage();

			await regularUserEmailNotVerified.pages.walletModal
				.steps()
				.verifyWithdrawBankEmailNotVerifiedMessage(
					userWalletTestDataDomain.countryAvailableBankPaymentMethods,
				);

			await regularUserEmailNotVerified.pages.walletModal
				.steps()
				.resendVerificationWithdrawEmailSuccessfully();

			await regularUserEmailNotVerified.pages.profilePage
				.steps()
				.verifyEmail(
					mailpitApi,
					userEmail,
					regularUserEmailNotVerified.page,
				);

			await regularUserEmailNotVerified.pages.homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();
		},
	);
});
