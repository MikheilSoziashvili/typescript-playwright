import { BaseTestFlow, testFlow } from "@test-flows";
import {
	CryptoConfig,
	CryptoFlowDependencies,
	DepositProcessResult,
} from "./types/crypto-flow-types";
import { TestUserRole } from "@enums/test-user-roles";
import { TransactionState } from "@enums/transaction-states";
import { getCookieHeader } from "@core/utils/utils";
import { step } from "decorators/step";

export class CryptoDepositVerificationTestFlow extends BaseTestFlow {
	constructor(private readonly deps: CryptoFlowDependencies) {
		super();
	}

	@testFlow("Verify crypto deposit")
	public async verifyDeposit(params: {
		config: CryptoConfig;
		processResult: DepositProcessResult;
		verifyBalanceAsFiat?: boolean; // optional — use for stablecoins where balance is 1:1 fiat (e.g. USDT)
	}): Promise<void> {
		const { config, processResult, verifyBalanceAsFiat = false } = params;

		await this.verifyDepositAsUser({
			config,
			processResult,
			verifyBalanceAsFiat,
		});
		await this.verifyDepositAsAdmin({ processResult });
	}

	@step("Verify deposit as user")
	private async verifyDepositAsUser(params: {
		config: CryptoConfig;
		processResult: DepositProcessResult;
		verifyBalanceAsFiat: boolean;
	}): Promise<void> {
		const { config, processResult, verifyBalanceAsFiat } = params;
		const {
			homePage,
			transactionsPage,
			transactionDetailsModal,
			userBalanceHandler,
		} = this.deps;

		await transactionsPage
			.steps()
			.verifyDepositTransactionStatusIs(TransactionState.COMPLETE);
		await transactionsPage.clickTransactionDetailsButton();
		await transactionDetailsModal
			.assertThat()
			.assertDepositAmountIn(
				config.cryptoTicker,
				parseFloat(processResult.amountToDeposit),
			);

		await homePage.navigate();

		const { unit } = config;
		const balanceAfterDepositUSD = unit
			? await userBalanceHandler.walletBalanceInFiatRounded(unit)
			: await userBalanceHandler.walletBalanceInFiatRounded();

		if (verifyBalanceAsFiat) {
			// Stablecoin path: balance delta equals deposit amount directly in USD
			const expectedBalance = parseFloat(
				(
					processResult.initialBalanceCoins +
					parseFloat(processResult.amountToDeposit)
				).toFixed(2),
			);
			await homePage
				.assertThat()
				.verifyBalance(balanceAfterDepositUSD, expectedBalance);
		} else {
			// Standard path: compute expected balance via unit conversion
			if (!unit)
				throw new Error(
					"CryptoConfig.unit is required for non-stablecoin deposit verification",
				);
			const expectedBalanceUSD = await userBalanceHandler
				.steps()
				.calculateExpectedBalanceAfterCryptoDeposit(
					processResult.initialBalanceCoins,
					processResult.amountToDeposit,
					unit,
				);
			await homePage
				.assertThat()
				.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);
		}
	}

	@step("Verify deposit as admin")
	private async verifyDepositAsAdmin(params: {
		processResult: DepositProcessResult;
	}): Promise<void> {
		const { processResult } = params;
		const { browserSessionManager, cryptoAdminPage, gamdomApi } = this.deps;

		const superAdmin = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
		);

		const superAdminCookie = getCookieHeader(
			superAdmin.getAuthenticatedUser().cookie,
		);

		await cryptoAdminPage
			.assertThat()
			.assertTransactionCryptoAmount(
				gamdomApi,
				superAdminCookie,
				processResult.txHash,
				parseFloat(processResult.amountToDeposit),
			);
	}
}
