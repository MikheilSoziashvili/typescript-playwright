import { test } from "@fixtures/fixtures";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";
import { testData } from "test-data/test-data-manager";
import { BNB_CONFIG } from "@test-flows/crypto/types/crypto-flow-types";
import { toFireblocksCryptoClient } from "@test-flows/crypto/adapters/fireblocks-crypto-client-adapter";
import { TestTag } from "@enums/test-tags";

test.describe(
	"BNB tests",
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
						cryptoName: Cryptocurrency.BNB,
						deposit: true,
						withdraw: true,
					},
				],
				nodes: [CryptoNode.fireBNB],
			});
		});

		test(
			"[ENG-15125] BNB - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
				bnbClient,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: BNB_CONFIG,
						client: toFireblocksCryptoClient(
							bnbClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: BNB_CONFIG,
					processResult: processResult,
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-15134] BNB - withdraw with regular user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					test.fixme(
						true,
						"Temporary skipped until wallet is toped up",
					);

					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: false,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: BNB_CONFIG,
								speed: speed,
								setupResult: setupResult,
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
				`[ENG-15165] BNB - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					test.fixme(
						true,
						"Temporary skipped until wallet is toped up",
					);

					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: true,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: BNB_CONFIG,
								speed: speed,
								setupResult: setupResult,
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
