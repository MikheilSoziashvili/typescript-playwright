import { BaseTestFlow, testFlow } from "@test-flows";
import {
	CryptoFlowDependencies,
	CryptoConfig,
	WithdrawalProcessResult,
	WithdrawalSetupResult,
	getCryptoTestData,
} from "./types/crypto-flow-types";
import {
	WithdrawalSpeed,
	withdrawalSpeedToFeeLevel,
} from "@enums/withdrawal-speeds";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { TestUserRole } from "@enums/test-user-roles";
import { Currency } from "@enums/currencies";
import { ToastTitle } from "@enums/toast-titles";
import { step } from "decorators/step";

interface UserWithdrawalResult {
	amountToWithdraw: number;
	withdrawalFee: string;
}

export class CryptoWithdrawalProcessTestFlow extends BaseTestFlow {
	constructor(private readonly deps: CryptoFlowDependencies) {
		super();
	}

	@testFlow("Process crypto withdrawal")
	public async processWithdrawal(params: {
		config: CryptoConfig;
		speed: WithdrawalSpeed;
		setupResult: WithdrawalSetupResult;
		expectedCustomFee?: number;
		destinationTag?: string;
		verifyCustomFee?: boolean;
	}): Promise<WithdrawalProcessResult> {
		const { config, speed, setupResult, expectedCustomFee, destinationTag, verifyCustomFee } =
			params;

		const userResult = await this.submitWithdrawalAsUser({
			config,
			speed,
			setupResult,
			expectedCustomFee,
			destinationTag,
			verifyCustomFee,
		});

		await this.processQueuedWithdrawalsAsAdmin();

		const withdrawnAmountAfterFee =
			userResult.amountToWithdraw - parseFloat(userResult.withdrawalFee);

		return {
			amountToWithdraw: userResult.amountToWithdraw,
			withdrawalFee: userResult.withdrawalFee,
			withdrawnAmountAfterFee: withdrawnAmountAfterFee,
		};
	}

	@step("Submit withdrawal as user")
	private async submitWithdrawalAsUser(params: {
		config: CryptoConfig;
		speed: WithdrawalSpeed;
		setupResult: WithdrawalSetupResult;
		expectedCustomFee?: number;
		destinationTag?: string;
		verifyCustomFee?: boolean;
	}): Promise<UserWithdrawalResult> {
		const { config, speed, setupResult, expectedCustomFee, destinationTag, verifyCustomFee } =
			params;
		const {
			browserSessionManager,
			homePage,
			walletModal,
			toast,
			gamdomApi,
			userBalanceHandler,
			testDataPredefined,
		} = this.deps;

		const { withdrawalAddress } = getCryptoTestData(
			testDataPredefined,
			config,
		);

		const userSession = await browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{ reuseContext: true },
		);
		const userCookie = getCookieHeader(
			userSession.getAuthenticatedUser().cookie,
		);

		await homePage.navigateToWallet();
		const fees = await gamdomApi.getWithdrawalFees(config.cryptoTicker, {
			cookie: userCookie,
		});
		const feeInCoins =
			fees[withdrawalSpeedToFeeLevel[speed]].totalFeeInCoins;
		const feeInUsd = await userBalanceHandler.coinsToFiatRounded(
			feeInCoins,
			Currency.USD,
		);
		const amountToWithdraw =
			feeInUsd +
			testDataPredefined.data.amountTolerance.amountToleranceUsd;

		const resolvedCustomFee = verifyCustomFee ? feeInUsd : expectedCustomFee;

		const withdrawalFee = await walletModal.withdrawCrypto({
			cryptocurrency: config.cryptocurrency,
			address: withdrawalAddress,
			amount: amountToWithdraw,
			speed: speed,
			isVip: setupResult.isVip,
			...(config.network && { network: config.network }),
			...(resolvedCustomFee !== undefined && { expectedCustomFee: resolvedCustomFee }),
			...(destinationTag !== undefined && { destinationTag }),
		});
		await toast.assertThat().titleIs(ToastTitle.SUCCESS);

		return {
			amountToWithdraw: amountToWithdraw,
			withdrawalFee: withdrawalFee,
		};
	}

	@step("Process queued withdrawals as admin")
	private async processQueuedWithdrawalsAsAdmin(): Promise<void> {
		const { page, browserSessionManager, cryptoAdminPage } = this.deps;

		const superAdminSession = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);
		await setAuthenticationCookies(
			page,
			superAdminSession.getAuthenticatedUser().cookie,
		);
		await cryptoAdminPage.sendQueuedWithdrawals();
	}
}
