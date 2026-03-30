import { test } from "@fixtures/fixtures";
import { CryptoTicker } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestTag } from "@enums/test-tags";
import { testData } from "test-data/test-data-manager";
import {
	USDT_ETH_CONFIG,
	USDT_TRX_CONFIG,
	USDT_BSC_CONFIG,
} from "@test-flows/crypto/types/crypto-flow-types";
import { toFireblocksCryptoClient } from "@test-flows/crypto/adapters/fireblocks-crypto-client-adapter";
import { CryptoOperationOptions } from "@core/types/types";
import { getCookieHeader } from "@core/utils/utils";
import { Currency } from "@enums/currencies";
import { TestUserRole } from "@enums/test-user-roles";
import { withdrawalSpeedToFeeLevel } from "@enums/withdrawal-speeds";

test.describe(
	"USDT tests",
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
						cryptoName: CryptoTicker.USDT,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: CryptoTicker.USDT_TRON,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: CryptoTicker.USDT_BSC,
						deposit: true,
						withdraw: true,
					},
				] as CryptoOperationOptions[],
				nodes: [
					CryptoNode.fireUSDT,
					CryptoNode.fireTRX_USDT,
					CryptoNode.fireUSDT_BSC,
				],
			});
		});

		test(
			"[ENG-10132] USDT_ETH - deposit via sepolia",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
				usdtClient,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: USDT_ETH_CONFIG,
						client: toFireblocksCryptoClient(
							usdtClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: USDT_ETH_CONFIG,
					processResult: processResult,
					verifyBalanceAsFiat: true,
				});
			},
		);

		test(
			"[ENG-10474] USDT_TRX - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
				usdtTrxClient,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: USDT_TRX_CONFIG,
						client: toFireblocksCryptoClient(
							usdtTrxClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: USDT_TRX_CONFIG,
					processResult: processResult,
					verifyBalanceAsFiat: true,
				});
			},
		);

		test(
			"[ENG-14995] USDT_BSC - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
				usdtBscClient,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: USDT_BSC_CONFIG,
						client: toFireblocksCryptoClient(
							usdtBscClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: USDT_BSC_CONFIG,
					processResult: processResult,
					verifyBalanceAsFiat: true,
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13331] USDT_ETH - withdraw with regular user - ${speed.toLowerCase()}`,
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
								config: USDT_ETH_CONFIG,
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
				`[ENG-13635] USDT_ETH - withdraw with vip user - ${speed.toLowerCase()}`,
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
								config: USDT_ETH_CONFIG,
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
				`[ENG-13482] USDT_TRX - withdraw with regular user - ${speed.toLowerCase()}`,
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
								config: USDT_TRX_CONFIG,
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
				`[ENG-13632] USDT_TRX - withdraw with vip user - ${speed.toLowerCase()}`,
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
								config: USDT_TRX_CONFIG,
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
				`[ENG-15019] USDT_BSC - withdraw with regular user - ${speed.toLowerCase()}`,
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
								config: USDT_BSC_CONFIG,
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
				`[ENG-15022] USDT_BSC - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
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
								config: USDT_BSC_CONFIG,
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

test.describe(
	"USDT tests with custom fees",
	testDetails().withTags(TestTag.SEQUENTIAL, JiraComponent.CRYPTO).apply(),
	() => {
		const cryptoWithdrawalDomainData =
			testData().fromDomain().cryptoWithdrawal;
		test.slow();

		test.beforeEach(
			async (
				{ cryptoAdminSetupTestFlow, testDataPredefined },
				testInfo,
			) => {
				const { customLowFee, customMidFee } =
					testDataPredefined.data.usdtAmountToDeposit;

				await cryptoAdminSetupTestFlow.setupCryptoOperations({
					testInfo: testInfo,
					operations: [
						{
							cryptoName: CryptoTicker.USDT,
							deposit: true,
							withdraw: true,
						},
					],
					nodes: [CryptoNode.fireUSDT],
					customFees: {
						[CryptoNode.fireUSDT]: {
							lowFee: customLowFee,
							midFee: customMidFee,
						},
					},
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-14706] USDT_ETH - withdraw with regular user and custom fees - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
					gamdomApi,
					userBalanceHandler,
					browserSessionManager,
				}) => {
					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: false,
						});

					const userSession = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
						{ reuseContext: true },
					);
					const userCookie = getCookieHeader(
						userSession.getAuthenticatedUser().cookie,
					);
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.USDT,
						{ cookie: userCookie },
					);
					const feeInCoins =
						fees[withdrawalSpeedToFeeLevel[speed]].totalFeeInCoins;
					const expectedCustomFee =
						await userBalanceHandler.coinsToFiatRounded(
							feeInCoins,
							Currency.USD,
						);

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: USDT_ETH_CONFIG,
								speed: speed,
								setupResult: setupResult,
								expectedCustomFee: expectedCustomFee,
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
				`[ENG-14775] USDT_ETH - withdraw with vip user and custom fees - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
					gamdomApi,
					userBalanceHandler,
					browserSessionManager,
				}) => {
					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: true,
						});

					const userSession = await browserSessionManager.loginAs(
						TestUserRole.REGULAR,
						{ reuseContext: true },
					);
					const userCookie = getCookieHeader(
						userSession.getAuthenticatedUser().cookie,
					);
					const fees = await gamdomApi.getWithdrawalFees(
						CryptoTicker.USDT,
						{ cookie: userCookie },
					);
					const feeInCoins =
						fees[withdrawalSpeedToFeeLevel[speed]].totalFeeInCoins;
					const expectedCustomFee =
						await userBalanceHandler.coinsToFiatRounded(
							feeInCoins,
							Currency.USD,
						);

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: USDT_ETH_CONFIG,
								speed: speed,
								setupResult: setupResult,
								expectedCustomFee: expectedCustomFee,
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
