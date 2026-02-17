import { BaseTestFlow, testFlow } from "@test-flows";
import {
	CryptoFlowDependencies,
	WithdrawalProcessResult,
	WithdrawalSetupResult,
	WithdrawalUserVerificationResult,
} from "./types/crypto-flow-types";
import { WithdrawalSpeed, withdrawalSpeedToFeeLevel } from "@enums/withdrawal-speeds";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { TestUserRole } from "@enums/test-user-roles";
import { TransactionState } from "@enums/transaction-states";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { TransactionType } from "@enums/transaction-types";
import { step } from "decorators/step";

export class CryptoWithdrawalVerificationTestFlow extends BaseTestFlow {
	constructor(private readonly deps: CryptoFlowDependencies) {
		super();
	}

	@testFlow("Verify crypto withdrawal")
	public async verifyWithdrawal(params: {
		speed: WithdrawalSpeed;
		setupResult: WithdrawalSetupResult;
		processResult: WithdrawalProcessResult;
	}): Promise<void> {
		const { speed, setupResult, processResult } = params;

		const userVerificationResult = await this.verifyWithdrawalAsUser({
			speed,
			setupResult,
			processResult,
		});

		await this.verifyWithdrawalAsAdmin({
			speed,
			processResult,
			userVerificationResult,
		});
	}

	@step("Verify withdrawal as user")
	private async verifyWithdrawalAsUser(params: {
		speed: WithdrawalSpeed;
		setupResult: WithdrawalSetupResult;
		processResult: WithdrawalProcessResult;
	}): Promise<WithdrawalUserVerificationResult> {
		const { speed, setupResult, processResult } = params;
		const {
			page,
			browserSessionManager,
			homePage,
			transactionsPage,
			transactionDetailsModal,
			userBalanceHandler,
		} = this.deps;

		const userSession = await browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{ reuseContext: true },
		);
		await setAuthenticationCookies(
			page,
			userSession.getAuthenticatedUser().cookie,
		);

		// Verify balance after withdrawal
		await homePage.navigate();
		const balanceAfterWithdrawUSD =
			await userBalanceHandler.walletBalanceInFiatRounded();

		await homePage
			.assertThat()
			.verifyBalanceWithTolerance(
				balanceAfterWithdrawUSD,
				setupResult.initialBalanceUSD - processResult.amountToWithdraw,
			);

		// Verify transaction status flow
		await transactionsPage
			.steps()
			.verifyWithdrawTransactionStatusIs(TransactionState.SENT);

		await transactionsPage
			.steps()
			.verifyWithdrawTransactionStatusIs(TransactionState.CONFIRMED);

		// Verify transaction details
		await transactionsPage.clickTransactionDetailsButton();
		await transactionDetailsModal
			.assertThat()
			.withdrawalTransactionDetailsAre(
				processResult.withdrawnAmountAfterFee,
				processResult.withdrawalFee,
				setupResult.isVip,
				speed,
			);

		const withdrawTransactionId =
			await transactionDetailsModal.getBlockchainTransactionId();

		return {
			withdrawTransactionId,
		};
	}

	@step("Verify withdrawal as admin")
	private async verifyWithdrawalAsAdmin(params: {
		speed: WithdrawalSpeed;
		processResult: WithdrawalProcessResult;
		userVerificationResult: WithdrawalUserVerificationResult;
	}): Promise<void> {
		const { speed, processResult, userVerificationResult } = params;
		const {
			page,
			browserSessionManager,
			cryptoAdminPage,
			userInfoAdminPage,
			transactionsAdminPage,
			userBalanceHandler,
			gamdomApi,
		} = this.deps;

		const superAdminSession = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);
		const superAdminCookie =
			superAdminSession.getAuthenticatedUser().cookie;

		// Verify transaction coins amount via API
		const superAdminCookieHeader = getCookieHeader(superAdminCookie);
		const withdrawnAmountAfterFeeInCoins =
			userBalanceHandler.usdToCoinsNetAfterFeeTrunc(
				processResult.amountToWithdraw,
				parseFloat(processResult.withdrawalFee),
			);

		await cryptoAdminPage
			.assertThat()
			.assertTransactionCoinsAmount(
				gamdomApi,
				superAdminCookieHeader,
				userVerificationResult.withdrawTransactionId,
				withdrawnAmountAfterFeeInCoins,
			);

		// Verify user info transactions tab
		await setAuthenticationCookies(page, superAdminCookie);
		const expectedFeeLevel = withdrawalSpeedToFeeLevel[speed];

		const userSession = await browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{ reuseContext: true },
		);
		const username =
			userSession.getAuthenticatedUser().user.username;

		await userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(username);
		await userInfoAdminPage.clickUserInfoTab(UserInfoTabs.Transactions);
		await transactionsAdminPage
			.steps()
			.fetchDataForRecordWithBalanceAndVerifyFeeLevel(
				TransactionType.WITHDRAWAL,
				expectedFeeLevel,
			);
	}
}
