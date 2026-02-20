import { BaseTestFlow, testFlow } from "@test-flows";
import {
	CryptoClient,
	CryptoConfig,
	CryptoFlowDependencies,
	DepositProcessResult,
	getCryptoTestData,
} from "./types/crypto-flow-types";
import { TestUserRole } from "@enums/test-user-roles";

export class CryptoDepositTestFlow extends BaseTestFlow {
	constructor(private readonly deps: CryptoFlowDependencies) {
		super();
	}

	@testFlow("Process crypto deposit")
	public async processDeposit(params: {
		config: CryptoConfig;
		client: CryptoClient;
		destinationTag?: number | string;
	}): Promise<DepositProcessResult> {
		const { config, client, destinationTag } = params;
		const {
			browserSessionManager,
			homePage,
			walletModal,
			userBalanceHandler,
			testDataPredefined,
		} = this.deps;

		const { amountToDeposit } = getCryptoTestData(
			testDataPredefined,
			config,
		);

		await browserSessionManager.loginAs(TestUserRole.REGULAR, {
			reuseContext: true,
		});

		await homePage.navigateToWallet();

		const { unit } = config;
		const initialBalanceCoins = unit
			? await userBalanceHandler.walletBalanceInCoins(unit)
			: await userBalanceHandler.walletBalanceInFiatRounded();

		await walletModal.selectPaymentMethod(config.cryptocurrency);

		if (config.network) {
			await walletModal.selectDepositNetwork(config.network);
		}

		const userDepositAddress = await walletModal.getDepositAddress();

		const depositTransaction = await client.sendToAddress(
			userDepositAddress,
			amountToDeposit,
			destinationTag,
		);

		await client.waitForCompletion(depositTransaction.id);

		const fullTransaction = await client.getTransaction(
			depositTransaction.id,
		);

		return {
			depositTransactionId: depositTransaction.id,
			txHash: fullTransaction.txHash,
			initialBalanceCoins: initialBalanceCoins,
			amountToDeposit: amountToDeposit,
		};
	}
}
