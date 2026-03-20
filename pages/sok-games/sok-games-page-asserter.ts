import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { SokGamesPage } from "./sok-games-page";

export class SokGamesPageAsserter extends BaseAsserter<SokGamesPage> {
	public constructor(page: SokGamesPage) {
		super(page);
	}

	@step("Verify bet amount is set to expected value")
	public async betAmountIsSetTo(amount: string): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.betAmountInput,
				expectedValue: amount,
			},
		]);
	}

	@step("Verify wallet currency icon is visible")
	public async walletCurrencyIconIsVisible(
		svgName: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.currencyIcon(svgName),
		]);
	}
}
