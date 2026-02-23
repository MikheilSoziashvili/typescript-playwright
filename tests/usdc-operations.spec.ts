import { test } from "@fixtures/fixtures";
import { CryptoTicker } from "@enums/cryptocurrencies";
import { CryptoNode } from "@enums/crypto-nodes";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { fireblocks } from "configuration";
import { JiraComponent } from "@enums/jira/jira-components";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";
import {
	USDC_ETH_CONFIG,
	USDC_SOL_CONFIG,
	USDC_BSC_CONFIG,
} from "@test-flows/crypto/types/crypto-flow-types";
import { toFireblocksCryptoClient } from "@test-flows/crypto/adapters/fireblocks-crypto-client-adapter";

test.describe(
	"USDC tests",
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
						cryptoName: CryptoTicker.USDC_ETH,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: CryptoTicker.USDC_SOL,
						deposit: true,
						withdraw: true,
					},
					{
						cryptoName: CryptoTicker.USDC_BSC,
						deposit: true,
						withdraw: true,
					},
				],
				nodes: [
					CryptoNode.fireUSDC_ETH,
					CryptoNode.fireUSDC_SOL,
					CryptoNode.fireUSDC_BSC,
				],
			});
		});

		test(
			"[ENG-10800] USDC_ETH - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdcEthClient,
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: USDC_ETH_CONFIG,
						client: toFireblocksCryptoClient(
							usdcEthClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: USDC_ETH_CONFIG,
					processResult: processResult,
					verifyBalanceAsFiat: true,
				});
			},
		);

		test(
			"[ENG-10915] USDC_SOL - deposit",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				usdcSolClient,
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: USDC_SOL_CONFIG,
						client: toFireblocksCryptoClient(
							usdcSolClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: USDC_SOL_CONFIG,
					processResult: processResult,
					verifyBalanceAsFiat: true,
				});
			},
		);

		test(
			"[ENG-15126] USDC_BSC - deposit",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				usdcBscClient,
				cryptoDepositTestFlow,
				cryptoDepositVerificationTestFlow,
			}) => {
				const processResult =
					await cryptoDepositTestFlow.processDeposit({
						config: USDC_BSC_CONFIG,
						client: toFireblocksCryptoClient(
							usdcBscClient,
							fireblocks.vaultId,
						),
					});

				await cryptoDepositVerificationTestFlow.verifyDeposit({
					config: USDC_BSC_CONFIG,
					processResult: processResult,
					verifyBalanceAsFiat: true,
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-13741] USDC_SOL - withdraw with vip user - ${speed.toLowerCase()}`,
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
								config: USDC_SOL_CONFIG,
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
				`[ENG-13744] USDC_ETH - withdraw with vip user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({
					cryptoWithdrawalSetupTestFlow,
					cryptoWithdrawalProcessTestFlow,
					cryptoWithdrawalVerificationTestFlow,
				}) => {
					test.fixme(true, "Skipped until wallet is topped up");

					const setupResult =
						await cryptoWithdrawalSetupTestFlow.setupUser({
							isVip: true,
						});

					const processResult =
						await cryptoWithdrawalProcessTestFlow.processWithdrawal(
							{
								config: USDC_ETH_CONFIG,
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
				`[ENG-14308] USDC_SOL - withdraw with regular user - ${speed.toLowerCase()}`,
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
								config: USDC_SOL_CONFIG,
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
				`[ENG-15173] USDC_BSC - withdraw with regular user - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
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
								config: USDC_BSC_CONFIG,
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
				`[ENG-15202] USDC_BSC - withdraw with vip user - ${speed.toLowerCase()}`,
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
								config: USDC_BSC_CONFIG,
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
	"USDC tests with custom fees",
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
					testDataPredefined.data.usdcSolAmountToDeposit;

				await cryptoAdminSetupTestFlow.setupCryptoOperations({
					testInfo: testInfo,
					operations: [
						{
							cryptoName: CryptoTicker.USDC_SOL,
							deposit: true,
							withdraw: true,
						},
					],
					nodes: [CryptoNode.fireUSDC_SOL],
					customFees: {
						[CryptoNode.fireUSDC_SOL]: {
							lowFee: customLowFee,
							midFee: customMidFee,
						},
					},
				});
			},
		);

		for (const speed of cryptoWithdrawalDomainData.withdrawalSpeeds) {
			test(
				`[ENG-14776] USDC_SOL - withdraw with regular user and custom fees - ${speed.toLowerCase()}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
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
								config: USDC_SOL_CONFIG,
								speed: speed,
								setupResult: setupResult,
								verifyCustomFee: true,
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
				`[ENG-14777] USDC_SOL - withdraw with vip user and custom fees - ${speed.toLowerCase()}`,
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
								config: USDC_SOL_CONFIG,
								speed: speed,
								setupResult: setupResult,
								verifyCustomFee: true,
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
