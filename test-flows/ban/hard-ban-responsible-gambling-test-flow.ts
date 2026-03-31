import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { TestUserRole } from "@enums/test-user-roles";
import {
	getCookieHeader,
	getCurrentDate,
	deleteFilesWithFilePaths,
	createPngImagePath,
	waitUntil,
} from "@core/utils/utils";
import { BanReason } from "@enums/ban-reasons";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";
import { ToastTitle } from "@enums/toast-titles";
import { GamdomApi } from "@api/gamdom-api";
import { OriginalGame } from "@enums/original-games";
import { CryptoNode } from "@enums/crypto-nodes";
import { HardBanResponsibleGamblingParams } from "./types/hard-ban-flow-types";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class HardBanResponsibleGamblingTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Execute hard ban responsible gambling scenario")
	public async execute(
		params: HardBanResponsibleGamblingParams,
	): Promise<void> {
		const {
			browserSessionManager,
			gamdomDb,
			gamdomApi,
			twoFaEnabled,
			testInfo,
			testData,
		} = params;

		const adminUser = await browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);
		const adminCookie = getCookieHeader(
			adminUser.getAuthenticatedUser().cookie,
		);

		await adminUser.pages.cryptoAdminPage.navigate();
		await adminUser.pages.cryptoAdminPage.toggleCryptoOperations([
			{
				cryptoName: CryptoTicker.USDT,
				deposit: true,
				withdraw: true,
			},
		]);
		await adminUser.pages.cryptoAdminPage.refreshCryptoData();
		await adminUser.pages.cryptoAdminPage
			.steps()
			.waitUntilCryptoDataRefreshed(testInfo);
		await adminUser.pages.cryptoAdminPage
			.steps()
			.setMinDepositAndWithdraw(CryptoNode.fireUSDT);

		const regularUser = await browserSessionManager.loginAs(
			TestUserRole.REGULAR,
			{
				regularUserOptions: {
					emailVerified: true,
					startingXp: testData.startingXp,
					amount: testData.walletAmount,
				},
			},
		);
		const { username, password, userId } =
			regularUser.getAuthenticatedUser().user;

		await regularUser.pages.originalsPage.navigateAndPlaceBet(
			OriginalGame.Dice,
			testData.betAmount,
			testData.betMultiplier,
		);

		await gamdomDb.insertRoyaltyUpReward(
			userId,
			testData.royaltyLevel,
			null,
			testData.rewardAmountCoins,
		);

		let qrCode2FAImagePath: string | undefined;
		if (twoFaEnabled) {
			qrCode2FAImagePath = createPngImagePath();
			await regularUser.pages.settingsPage
				.steps()
				.navigateAndEnable2FaAuthentication(qrCode2FAImagePath);
		}

		await regularUser.pages.homePage.navigate();

		await (
			await adminUser.apis.gamdomApi
		).banUser(userId, BanReason.RESPONSIBLE_GAMBLING, {
			Cookie: adminCookie,
		});

		await this.verifyBannedRestrictions(regularUser);

		await this.claimRewardsAndWithdrawBalance({
			regularUser: regularUser,
			adminUser: adminUser,
			gamdomApi: gamdomApi,
			adminCookie: adminCookie,
			userId: userId,
			username: username,
			withdrawalAddress: testData.withdrawalAddress,
			twoFaScreenshotPath: qrCode2FAImagePath,
		});

		if (qrCode2FAImagePath) {
			await deleteFilesWithFilePaths([qrCode2FAImagePath]);
		}

		await this.verifyAccountLock(
			regularUser,
			username,
			password,
			testData.banReason,
		);
	}

	private async verifyBannedRestrictions(
		regularUser: BrowserUserSession,
	): Promise<void> {
		await waitUntil(
			async () => {
				try {
					await regularUser.page.reload();
					await regularUser.pages.homePage
						.assertThat()
						.isTopHardBannedBannerDisplayed();
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage:
					"Hard ban banner was not displayed after banning the user",
				timeoutSeconds: TimeoutSeconds.THIRTY,
				intervalSeconds: TimeoutSeconds.FIVE,
			},
		);

		await regularUser.pages.homePage.authenticatedHeader
			.assertThat()
			.bannedUserAllowedNavigationIsVisible();
		await regularUser.pages.homePage.authenticatedHeader
			.assertThat()
			.bannedUserRestrictedNavigationIsNotVisible();

		await regularUser.pages.homePage.authenticatedHeader.expandChatIfNotVisible();
		await regularUser.pages.chat
			.assertThat()
			.chatInputIsDisabledForBannedUser();
	}

	private async claimRewardsAndWithdrawBalance(params: {
		regularUser: BrowserUserSession;
		adminUser: BrowserUserSession;
		gamdomApi: GamdomApi;
		adminCookie: string;
		userId: number;
		username: string;
		withdrawalAddress: string;
		twoFaScreenshotPath?: string;
	}): Promise<void> {
		const {
			regularUser,
			adminUser,
			gamdomApi,
			adminCookie,
			userId,
			username,
			withdrawalAddress,
			twoFaScreenshotPath,
		} = params;

		await regularUser.pages.rewardsPage.navigate();
		await regularUser.pages.rewardsPage.navigateToRewardInSlider(
			RewardsRoyaltyUpRanks.BRONZE_1,
		);
		await regularUser.pages.rewardsPage.map
			.royaltyUpItemClaimButton(RewardsRoyaltyUpRanks.BRONZE_1)
			.click();

		await regularUser.pages.homePage.navigate();
		await regularUser.pages.homePage.clickWalletButton();
		await regularUser.pages.walletModal
			.assertThat()
			.withdrawAndVaultTabsAreVisible();
		await regularUser.pages.walletModal
			.assertThat()
			.depositTabIsNotVisible();

		// First click selects the crypto category, second click confirms selection
		await regularUser.pages.walletModal.selectPaymentMethod(
			Cryptocurrency.Tether,
		);
		await regularUser.pages.walletModal.selectPaymentMethod(
			Cryptocurrency.Tether,
		);
		await regularUser.pages.walletModal.map
			.withdrawAddressInput()
			.fill(withdrawalAddress);

		const userBalanceHandler = await regularUser.userBalanceHandler();
		const balanceUsd =
			await userBalanceHandler.walletBalanceInFiatRounded();
		await regularUser.pages.walletModal.fillWithdrawalAmount(balanceUsd);
		await regularUser.pages.walletModal.clickCryptoWithdrawButton();

		if (twoFaScreenshotPath) {
			await regularUser.pages.walletModal.twoFactorAuthModal
				.steps()
				.generateAndEnter2FaCodeSuccessfully(twoFaScreenshotPath);
		}

		await regularUser.pages.toast.assertThat().titleIs(ToastTitle.SUCCESS);

		await regularUser.pages.homePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(0);

		await adminUser.pages.cryptoAdminPage
			.steps()
			.sendQueuedAndWaitForProcessing(
				gamdomApi,
				userId,
				username,
				adminCookie,
			);
	}

	private async verifyAccountLock(
		regularUser: BrowserUserSession,
		username: string,
		password: string,
		banReason: string,
	): Promise<void> {
		await regularUser.pages.bannedUserPage.steps().waitForAutoLogout();

		await regularUser.pages.homePage.navigate();
		await regularUser.pages.homePage.steps().loginUser(username, password, {
			expectErrors: true,
		});

		await regularUser.pages.bannedUserPage
			.steps()
			.verifyBannedPageWithReason(`${banReason} - ${getCurrentDate()}`);
	}
}
