import { test } from "@fixtures/fixtures";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";
import { JiraComponent } from "@enums/jira/jira-components";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { WithdrawalSpeed } from "@enums/withdrawal-speeds";
import { generateRandomString } from "../core/utils/utils";

test.describe("Low Hot Wallet Balance notifications tests", () => {
	test.beforeEach(
		async ({ browserSessionManager, cryptoAdminPage }, testInfo) => {
			await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
				reuseContext: true,
			});
			await cryptoAdminPage.navigate();
			await cryptoAdminPage.enableAllCryptoOperations();
			await cryptoAdminPage.refreshCryptoData();
			await cryptoAdminPage
				.steps()
				.waitUntilCryptoDataRefreshed(testInfo);
			await cryptoAdminPage.setUserPayWd(CryptoNode.fireUSDT, {
				enabled: true,
			});
			await cryptoAdminPage
				.steps()
				.waitUntilCryptoDataRefreshed(testInfo);
		},
	);

	test.afterEach(async ({ gamdomCryptoApi }) => {
		await gamdomCryptoApi.resetHotWalletE2EConfig();
	});

	test.slow();
	test(
		"[ENG-6384] [Crypto] Notification rate limiting on low hot wallet balance",
		testDetails()
			.withTags(
				TestTag.SEQUENTIAL,
				JiraComponent.CRYPTO,
				JiraComponent.WITHDRAWAL,
			)
			.withAuthor(JiraUser.YUKSEL_CHAUSH)
			.apply(),
		async ({
			gamdomCryptoApi,
			testDataDomain,
			slackCryptoLowWalletBalanceChannel,
			slackWebApiFacade,
		}) => {
			const slackFacade = slackWebApiFacade.for(
				slackCryptoLowWalletBalanceChannel,
			);

			await gamdomCryptoApi.setHotWalletE2EConfig(
				testDataDomain.hotWallet.lowBalanceAlertScenario,
			);

			await slackFacade
				.assertThat()
				.lowHotWalletBalanceNotificationsReceived({
					expectedTickers:
						testDataDomain.hotWallet.lowBalanceAlertTickers,
					messagesCount: 15,
					timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
					pollIntervalSeconds: TimeoutSeconds.THIRTY,
				});
		},
	);

	test(
		"[ENG-6382] [Crypto] Notification not enough balance for withdrawal on low hot wallet balance",
		testDetails()
			.withTags(
				TestTag.SEQUENTIAL,
				JiraComponent.CRYPTO,
				JiraComponent.WITHDRAWAL,
			)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async (
			{
				cryptoAdminPage,
				slackCryptoLowWalletBalanceChannel,
				slackWebApiFacade,
				gamdomCryptoApi,
				testDataDomain,
				browserSessionManager,
			},
			testInfo,
		) => {
			const additionalAmount = 1000;
			const usdtAmount = await cryptoAdminPage.getUsdAmountByCryptoTicker(
				CryptoTicker.USDT,
			);
			const maxDepositAndWithdrawValue = (
				usdtAmount +
				additionalAmount +
				additionalAmount
			).toString();

			const slackFacade = slackWebApiFacade.for(
				slackCryptoLowWalletBalanceChannel,
			);

			await gamdomCryptoApi.setHotWalletE2EConfig(
				testDataDomain.hotWallet.lowBalanceOnWithdrawalScenario,
			);

			await cryptoAdminPage
				.steps()
				.setMaxDepositAndWithdraw(
					CryptoNode.fireUSDT,
					maxDepositAndWithdrawValue,
					maxDepositAndWithdrawValue,
				);
			await cryptoAdminPage
				.steps()
				.waitUntilCryptoDataRefreshed(testInfo);

			const regularUser = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
				{
					reuseContext: true,
				},
			);

			const userId = regularUser.getAuthenticatedUser().user.userId;
			const address = generateRandomString({ length: 5 });

			await regularUser.pages.diceGamePage.navigate();
			await regularUser.pages.diceGamePage.rollDiceWithAmount(50);
			await regularUser.pages.homePage.navigateToWallet();
			await regularUser.pages.walletModal.withdrawCrypto({
				cryptocurrency: Cryptocurrency.Tether,
				address: address,
				amount: usdtAmount + additionalAmount,
				speed: WithdrawalSpeed.Standard,
			});

			await slackFacade
				.assertThat()
				.lowWalletBalanceOnWithdrawalNotificationReceived({
					cryptoTicker: CryptoTicker.USDT,
					userId: userId,
					address: address,
					messagesCount: 20,
					timeoutSeconds: TimeoutSeconds.THIRTY,
					pollIntervalSeconds: TimeoutSeconds.TWO,
				});
		},
	);
});
