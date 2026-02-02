import { BaseTestFlow } from "@test-flows";
import { testFlow } from "@test-flows";
import { WalletType } from "@enums/wallet-types";
import {
	toWalletUnit,
	toCurrencyEnum,
} from "@core/utils/currency-wallet-utils";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { Unit } from "@enums/units";
import { Currency } from "@enums/currencies";

export class PlinkoBetExecutionFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Place Plinko bet")
	public async placeBet(params: {
		user: BrowserUserSession;
		wallet: string;
		betCurrency: string;
		betAmount: number;
	}): Promise<{
		walletUnit: Unit;
		betCurrency: Currency;
		coinsBefore: number;
		winMultiplier: number;
	}> {
		const { user } = params;

		await user.pages.homePage.authenticatedHeader.changeWalletAndCurrency(
			params.wallet,
			params.betCurrency,
		);

		const walletUnit = toWalletUnit(params.wallet);
		const betCurrency = toCurrencyEnum(params.betCurrency);

		await user.pages.plinkoGamePage
			.assertThat()
			.betAmountCurrencyChanged(betCurrency);

		const balanceHandler = await user.userBalanceHandler();
		const coinsBefore = await balanceHandler.walletBalanceInCoins(
			walletUnit,
			WalletType.DEFAULT,
		);

		await user.pages.plinkoGamePage.startManualBet(
			params.betAmount.toString(),
		);

		await user.pages.plinkoGamePage.steps().waitForSlidersToBeActive();

		const winMultiplier = await user.pages.plinkoGamePage
			.steps()
			.getInGameChipsHistoryButtonValue();

		return {
			walletUnit,
			betCurrency,
			coinsBefore,
			winMultiplier,
		};
	}
}
