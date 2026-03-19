import { BaseTestFlow } from "@test-flows";
import { testFlow } from "@test-flows";
import { WalletType } from "@enums/wallet-types";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";

export class PlinkoBalanceVerificationFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Verify balance after Plinko bet")
	async verifyBalance(params: {
		user: BrowserUserSession;
		walletUnit: Unit;
		betAmount: number;
		betCurrency: Currency;
		coinsBefore: number;
		winMultiplier: number;
	}): Promise<void> {
		const balanceHandler = await params.user.userBalanceHandler();

		const stakeCoins = await balanceHandler.convertDisplayCurrencyToCoins(
			params.betAmount,
			params.betCurrency,
		);

		const payoutCoins = balanceHandler.calculatePayoutCoins(
			stakeCoins,
			params.winMultiplier,
		);

		const expectedCoinsAfter = await params.user.pages.plinkoGamePage
			.steps()
			.calculateExpectedBalance(
				params.coinsBefore,
				stakeCoins,
				payoutCoins,
			);

		await params.user.pages.homePage.map.waitForStableBoundingBox({
			locator:
				await params.user.pages.homePage.authenticatedHeader.map.getLoadedAccountBalance(),
		});

		const coinsAfter = await balanceHandler.walletBalanceInCoins(
			params.walletUnit,
			WalletType.DEFAULT,
		);

		await params.user.pages.plinkoGamePage
			.assertThat()
			.verifyBalanceWithTolerance(coinsAfter, expectedCoinsAfter);
	}
}
