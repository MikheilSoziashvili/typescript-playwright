import { BaseTestFlow, testFlow } from "@test-flows";
import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import { UserTags } from "@enums/db/user-tags";
import {
	WithdrawalSpeed,
	withdrawalSpeedToFeeLevel,
} from "@enums/withdrawal-speeds";
import { ToastTitle } from "@enums/toast-titles";
import { Currency } from "@enums/currencies";
import { getCookieHeader } from "@core/utils/utils";
import { CryptoConfig, getCryptoTestData } from "./types/crypto-flow-types";
import { HomePage } from "@pages/home-page/home-page";
import { WalletModal } from "@pages/modals/wallet/wallet-modal";
import { Toast } from "@pages/components/toast/toast";
import { CryptoAdminPage } from "@pages/admin/crypto-admin/crypto-admin-page";
import { UserBalanceHandler } from "@core/handlers/user-balance-handler/user-balance-handler";
import { GamdomApi } from "@api/gamdom-api";
import { PredefinedDataSource } from "test-data/core/predefined-data-source";

export interface StreamerWithdrawalReviewDependencies {
	browserSessionManager: BrowserSessionManager;
	homePage: HomePage;
	walletModal: WalletModal;
	toast: Toast;
	cryptoAdminPage: CryptoAdminPage;
	userBalanceHandler: UserBalanceHandler;
	gamdomApi: GamdomApi;
	testDataPredefined: PredefinedDataSource;
}

export class StreamerWithdrawalReviewTestFlow extends BaseTestFlow {
	constructor(private readonly deps: StreamerWithdrawalReviewDependencies) {
		super();
	}

	@testFlow("Execute streamer withdrawal review scenario")
	public async execute(params: { config: CryptoConfig }): Promise<void> {
		const { config } = params;
		const streamerSession = await this.loginAsStreamer();
		await this.submitWithdraw(streamerSession, config);
		await this.verifyWithdrawalInReviewingState(streamerSession);
	}

	@testFlow("Login as streamer user")
	private async loginAsStreamer() {
		const { browserSessionManager } = this.deps;

		return browserSessionManager.loginAs(TestUserRole.REGULAR, {
			reuseContext: true,
			regularUserOptions: {
				wagered: 100000,
				tags: UserTags.Streamer,
			},
		});
	}

	@testFlow("Submit crypto withdrawal")
	private async submitWithdraw(
		streamerSession: BrowserUserSession,
		config: CryptoConfig,
	): Promise<void> {
		const {
			gamdomApi,
			userBalanceHandler,
			testDataPredefined,
			homePage,
			walletModal,
			toast,
		} = this.deps;

		const streamerCookie = getCookieHeader(
			streamerSession.getAuthenticatedUser().cookie,
		);

		const fees = await gamdomApi.getWithdrawalFees(config.cryptoTicker, {
			cookie: streamerCookie,
		});
		const feeInCoins =
			fees[withdrawalSpeedToFeeLevel[WithdrawalSpeed.Standard]]
				.totalFeeInCoins;
		const feeInUsd = await userBalanceHandler.coinsToFiatRounded(
			feeInCoins,
			Currency.USD,
		);
		const amountToWithdraw =
			feeInUsd +
			testDataPredefined.data.amountTolerance.amountToleranceUsd;

		const { withdrawalAddress } = getCryptoTestData(
			testDataPredefined,
			config,
		);

		await homePage.navigateToWallet();
		await walletModal.withdrawCrypto({
			cryptocurrency: config.cryptocurrency,
			address: withdrawalAddress,
			amount: amountToWithdraw,
			speed: WithdrawalSpeed.Standard,
			isVip: false,
		});
		await toast.assertThat().titleIs(ToastTitle.SUCCESS);
	}

	@testFlow("Verify withdrawal is in reviewing state via admin API")
	private async verifyWithdrawalInReviewingState(
		streamerSession: BrowserUserSession,
	): Promise<void> {
		const { browserSessionManager, gamdomApi, cryptoAdminPage } = this.deps;

		const superAdminSession = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);
		const superAdminCookie = getCookieHeader(
			superAdminSession.getAuthenticatedUser().cookie,
		);

		await cryptoAdminPage
			.assertThat()
			.withdrawalIsInReviewingState(
				gamdomApi,
				superAdminCookie,
				streamerSession.getAuthenticatedUser().user.userId,
			);
	}
}
