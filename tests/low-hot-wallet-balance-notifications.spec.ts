import { test } from "@fixtures/fixtures";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";
import { JiraComponent } from "@enums/jira/jira-components";

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
});
