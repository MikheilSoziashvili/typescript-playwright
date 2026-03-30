import { test } from "@fixtures/fixtures";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import { testData } from "test-data/test-data-manager";
import { XRP_CONFIG } from "@test-flows/crypto/types/crypto-flow-types";
import { toXrpCryptoClient } from "@test-flows/crypto/adapters/xrp-crypto-client-adapter";
import { TestTag } from "@enums/test-tags";

test.describe(
	"XRP tests",
	testDetails().withTags(JiraComponent.CRYPTO).apply(),
	() => {
		const cryptoWithdrawalDomainData =
			testData().fromDomain().cryptoWithdrawal;
		test.slow();

		test.beforeEach(async ({ cryptoAdminSetupTestFlow }, testInfo) => {
			await cryptoAdminSetupTestFlow.setupCryptoOperations({
				testInfo: testInfo,
				operations: [
					{
						cryptoName: Cryptocurrency.Ripple,
						deposit: true,
						withdraw: true,
					},
				],
				nodes: [CryptoNode.fireXRP],
			});
		});

		test(
			"[ENG-10212] XRP - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				xrpTestnetClient,
				browserSessionManager,
				homePage,
				walletModal,
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});
				await homePage.navigateToWallet();
				const { destinationTag } =
					await walletModal.selectXrpAndGetDepositDetails();

				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: XRP_CONFIG,
						client: toXrpCryptoClient(xrpTestnetClient),
						destinationTag: destinationTag,
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: XRP_CONFIG,
					processResult: processResult,
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13678] XRP - withdraw with regular user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					browserSessionManager,
					homePage,
					walletModal,
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});
					await homePage.navigateToWallet();
					const { destinationTag } =
						await walletModal.selectXrpAndGetDepositDetails();

					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: false,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: XRP_CONFIG,
								speed: speed,
								setupResult: setupResult,
								destinationTag: String(destinationTag),
							},
						);

					await cryptoWithdrawalVerificationTestFlow.verifyWithdrawal(
						{
							speed: speed,
							setupResult: setupResult,
							processResult: processResult,
						},
					);
				},
			);
		}

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13560] XRP - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					browserSessionManager,
					homePage,
					walletModal,
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});
					await homePage.navigateToWallet();
					const { destinationTag } =
						await walletModal.selectXrpAndGetDepositDetails();

					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: true,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: XRP_CONFIG,
								speed: speed,
								setupResult: setupResult,
								destinationTag: String(destinationTag),
							},
						);

					await cryptoWithdrawalVerificationTestFlow.verifyWithdrawal(
						{
							speed: speed,
							setupResult: setupResult,
							processResult: processResult,
						},
					);
				},
			);
		}
	},
);
