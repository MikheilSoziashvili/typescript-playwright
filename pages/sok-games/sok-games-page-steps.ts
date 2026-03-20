import { WALLET_SVG_NAME } from "@constants/wallet-svg-name-map";
import { Wallet } from "@enums/wallets";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { SokGamesPage } from "./sok-games-page";

export class SokGamesPageSteps extends BasePageStep<SokGamesPage> {
	public constructor(gamdomPage: SokGamesPage) {
		super(gamdomPage);
	}

	@step("Switch through all wallets, verify and bet min")
	public async switchAllWalletsVerifyAndBet(
		wallets: Wallet[],
		minBetAmount: string,
	): Promise<void> {
		for (const wallet of wallets) {
			await this.switchWalletVerifyAndBet(wallet, minBetAmount);
		}
	}

	@step("Switch wallet, press MIN, verify and place bet")
	public async switchWalletVerifyAndBet(
		wallet: Wallet,
		minBetAmount: string,
	): Promise<void> {
		const svgName = WALLET_SVG_NAME[wallet];

		await this.gamdomPage.authenticatedHeader.changeWallet(wallet);
		await this.gamdomPage.pressMinButton();
		await this.gamdomPage.assertThat().betAmountIsSetTo(minBetAmount);
		await this.gamdomPage.assertThat().walletCurrencyIconIsVisible(svgName);
		await this.gamdomPage.placeSingleBet();
	}
}
