import { test } from "@fixtures/fixtures";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { testData } from "test-data/test-data-manager";
import { BTC_CONFIG, LTC_CONFIG } from "@test-flows/crypto/types/crypto-flow-types";
import { toUtxoCryptoClient } from "@test-flows/crypto/adapters/utxo-crypto-client-adapter";
import { Timeout } from "@enums/timeout";
import { TestTag } from "@enums/test-tags";

test.describe(
	"UTXO tests",
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
						cryptoName: Cryptocurrency.Bitcoin,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: Cryptocurrency.Litecoin,
						deposit: true,
						withdraw: true,
					},
				],
				nodes: [CryptoNode.nodeBTC1, CryptoNode.nodeLTC1],
			});
		});

		test.setTimeout(Timeout.EXTRA_MAX + Timeout.SUPER_MAX);

		test(
			"[ENG-13639] BTC - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				btcClient,
				testDataPredefined,
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
			}) => {
				const { feeRate } = testDataPredefined.data.btcAmountToDeposit;

				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: BTC_CONFIG,
						client: toUtxoCryptoClient(btcClient, {
							replaceable: false,
							feeRate: feeRate,
						}),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: BTC_CONFIG,
					processResult: processResult,
				});
			},
		);

		test(
			"[ENG-10267] LTC - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				ltcClient,
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: LTC_CONFIG,
						client: toUtxoCryptoClient(ltcClient, {
							replaceable: false,
						}),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: LTC_CONFIG,
					processResult: processResult,
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13640] BTC - withdraw with regular user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
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
								config: BTC_CONFIG,
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
				`[ENG-14322] BTC - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
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
								config: BTC_CONFIG,
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
				`[ENG-14323] LTC - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					test.fixme(
						true,
						"Temporary skipped until LTC wallet is toped up",
					);

					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: true,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: LTC_CONFIG,
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
