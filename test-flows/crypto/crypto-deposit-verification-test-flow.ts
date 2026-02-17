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
	}): Promise<void> {
		const { config, processResult } = params;

		await this.verifyDepositAsUser({ config, processResult });
		await this.verifyDepositAsAdmin({ processResult });
	}

	@step("Verify deposit as user")
	private async verifyDepositAsUser(params: {
		config: CryptoConfig;
		processResult: DepositProcessResult;
	}): Promise<void> {
		const { config, processResult } = params;
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

		const expectedBalanceUSD = await userBalanceHandler
			.steps()
			.calculateExpectedBalanceAfterCryptoDeposit(
				processResult.initialBalanceCoins,
				processResult.amountToDeposit,
				config.unit,
			);

		const balanceAfterDepositUSD =
			await userBalanceHandler.walletBalanceInFiatRounded(config.unit);

		await homePage
			.assertThat()
			.verifyBalance(balanceAfterDepositUSD, expectedBalanceUSD);
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
