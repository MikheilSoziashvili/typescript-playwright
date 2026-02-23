import { test } from "@fixtures/fixtures";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";
import { testData } from "test-data/test-data-manager";
import { SOL_CONFIG } from "@test-flows/crypto/types/crypto-flow-types";
import { toFireblocksCryptoClient } from "@test-flows/crypto/adapters/fireblocks-crypto-client-adapter";

test.describe(
	"SOL tests",
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
						cryptoName: Cryptocurrency.Solana,
						deposit: true,
						withdraw: true,
					},
				],
				nodes: [CryptoNode.fireSOL],
			});
		});

		test(
			"[ENG-10303] SOL - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				solClient,
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: SOL_CONFIG,
						client: toFireblocksCryptoClient(
							solClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: SOL_CONFIG,
					processResult: processResult,
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-11991] SOL - withdraw with regular user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: false,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: SOL_CONFIG,
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
				`[ENG-12137] SOL - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: true,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: SOL_CONFIG,
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
