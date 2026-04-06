import { PT_PROXY_CREDENTIALS } from "@constants/proxies";
import { TIP_RAIN } from "@constants/tip-rain";
import { buildTipRainUserMessageInfo } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	createBrowserContextWithProxy,
	createPngImagePath,
	deleteFilesWithFilePaths,
	getCookieHeader,
	initializePageObjectsWithCookies,
	waitUntil,
} from "@core/utils/utils";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { KycLevels } from "@enums/verification-enums";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { KycStatus } from "@enums/verification-enums";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestTag } from "@enums/test-tags";

test.describe("Rain tests", () => {
	let qrCode2FAImagePath: string;
	const { tipRainAmount, baseRainAmount } =
		testData().fromPredefined().data.rainAmounts;

	const rainDomainData = testData().fromDomain().rain;

	test(
		"[ENG-15626] Rain - cannot claim rain with no KYC level",
		testDetails()
			.withTags(JiraComponent.VERIFICATION, JiraComponent.RAIN, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.ANGEL_PETROV)
			.apply(),
		async ({ homePage, chat, browserSessionManager }) => {
			await browserSessionManager.loginAs(TestUserRole.REGULAR, {
				reuseContext: true,
			});

			await homePage.navigate();
			await chat.steps().openChatAndVerify();
			await chat.steps().waitUponRainAndClaim();
			await chat.assertThat().rainCannotBeClaimed();
			await chat.steps().rainClaimButtonRedirectsToFaq();
		},
	);

	for (const kycLevel of rainDomainData.cannotClaimKycLevels) {
		test(
			`[ENG-15626] Rain - cannot claim rain with KYC level: ${kycLevel.level}`,
			testDetails()
				.withTags(JiraComponent.VERIFICATION, JiraComponent.RAIN, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.ANGEL_PETROV)
				.apply(),
			async ({ homePage, chat, browserSessionManager, gamdomDb }) => {
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{ reuseContext: true },
				);

				await gamdomDb.insertUserKycLevel(
					regularUser.getAuthenticatedUser().user.userId,
					kycLevel.level,
					kycLevel.type,
					KycStatus.APPROVED,
					true,
					false,
				);

				await homePage.navigate();
				await chat.steps().openChatAndVerify();
				await chat.steps().waitUponRainAndClaim();
				await chat.assertThat().rainCannotBeClaimed();
				await chat.steps().rainClaimButtonRedirectsToFaq();
			},
		);
	}

	for (const kycConfig of rainDomainData.canClaimKycLevels) {
		test(
			`[ENG-15626] Rain - can claim rain with KYC level: ${kycConfig.label}`,
			testDetails()
				.withTags(JiraComponent.VERIFICATION, JiraComponent.RAIN, TestTag.ACCEPTANCE)
				.withJiraBugTickets("5094")
				.withAuthor(JiraUser.ANGEL_PETROV)
				.apply(),
			async ({
				homePage,
				chat,
				browserSessionManager,
				gamdomDb,
				userBalanceHandler,
			}) => {
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{ reuseContext: true },
				);

				for (const kycLevel of kycConfig.levels) {
					await gamdomDb.insertUserKycLevel(
						regularUser.getAuthenticatedUser().user.userId,
						kycLevel.level,
						kycLevel.type,
						KycStatus.APPROVED,
						true,
						false,
					);
				}

				await homePage.navigate();
				await chat.steps().openChatAndVerify();

				const initialAccountBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await chat.steps().waitUponRainAndClaim();
				await chat.assertThat().rainClaimedMessageIsDisplayed();

				const initialRainBotMessageCount =
					await chat.map.rainBotMessageLocator.count();

				await waitUntil(
					async () =>
						(await chat.map.rainBotMessageLocator.count()) >
						initialRainBotMessageCount,
					{
						errorMessage: "New rain bot message did not appear",
						timeoutSeconds:
							TimeoutSeconds.THIRTY + TimeoutSeconds.ONE_TWENTY,
						intervalSeconds: 2,
					},
				);

				const userCount = await chat.getRainUserCount();
				const expectedUserRainClaim = baseRainAmount / userCount;
				const expectedUserBalance =
					initialAccountBalance + expectedUserRainClaim;

				await homePage.authenticatedHeader
					.assertThat()
					.accountBalanceIs(expectedUserBalance);
			},
		);
	}

	test(
		"[ENG-2564] Tip rain - Require new 2FA code when IP of user changes",
		testDetails()
			.withTags(TestTag.SEQUENTIAL_PARALLEL, JiraComponent.TWO_FA, JiraComponent.RAIN, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.ANGEL_PETROV)
			.apply(),
		async ({
			homePage,
			chat,
			tipRainModal,
			twoFactorAuthModal,
			settingsPage,
			browser,
			gamdomDb,
			browserSessionManager,
			gamdomApi,
		}) => {
			const regularUser = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
				{ reuseContext: true },
			);

			const userId = regularUser.getAuthenticatedUser().user.userId;
			const username = regularUser.getAuthenticatedUser().user.username;

			await gamdomDb.insertUserKycLevel(
				userId,
				KycLevels.LEVEL_2,
				null,
				KycStatus.APPROVED,
				true,
				false,
			);

			const pages = {
				homePage,
				tipRainModal,
				twoFactorAuthModal,
				settingsPage,
				chat,
			};

			const superAdmin = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
			);

			const superAdminCookie = getCookieHeader(
				superAdmin.getAuthenticatedUser().cookie,
			);

			qrCode2FAImagePath = createPngImagePath();
			await settingsPage
				.steps()
				.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);

			await homePage.navigate();
			await homePage.authenticatedHeader.expandChatIfNotVisible();
			await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
			await twoFactorAuthModal
				.steps()
				.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
			await tipRainModal
				.steps()
				.verifyModalAndTipRainSuccessfully(
					gamdomApi,
					superAdminCookie,
					tipRainAmount,
				);
			await chat.assertThat().isInfoMessageVisibleByText(
				buildTipRainUserMessageInfo({
					username: username,
					tipRainAmount: tipRainAmount,
				}),
			);

			await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
			await twoFactorAuthModal.assertThat().modal2FaNotDisplayed();

			await initializePageObjectsWithCookies(
				await regularUser.context.cookies(),
				regularUser.page,
				await createBrowserContextWithProxy(
					browser,
					PT_PROXY_CREDENTIALS,
				),
				...Object.values(pages),
			);

			await homePage.navigate();
			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();
			await homePage.authenticatedHeader.expandChatIfNotVisible();
			await chat.steps().verifyChatAndSendMessage(TIP_RAIN);
			await twoFactorAuthModal
				.steps()
				.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
			await tipRainModal
				.steps()
				.verifyModalAndTipRainSuccessfully(
					gamdomApi,
					superAdminCookie,
					tipRainAmount,
				);
			await chat.assertThat().isInfoMessageVisibleByText(
				buildTipRainUserMessageInfo({
					username: username,
					tipRainAmount: tipRainAmount,
				}),
			);
			await deleteFilesWithFilePaths([qrCode2FAImagePath]);
		},
	);
});
