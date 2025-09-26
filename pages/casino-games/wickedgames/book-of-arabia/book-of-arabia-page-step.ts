import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { BookOfArabiaPage } from "./book-of-arabia-page";

export class BookOfArabiaPageSteps extends BasePageStep<BookOfArabiaPage> {
	public constructor(gamdomPage: BookOfArabiaPage) {
		super(gamdomPage);
	}

	@step("Set bet amount to {amount}")
	public async setBetAmountAndSpin(amount: number): Promise<void> {
		await this.gamdomPage.map.betContainer.click();
		await this.gamdomPage.map.betOptionsRoot.waitFor({ state: "visible" });

		const betOption = this.gamdomPage.map.getBetOption(amount);
		await betOption.click();
		await this.gamdomPage.map.spinButton.click();
	}

	@step("Start game and spin with bet {betAmount}")
	public async startGameAndSpin(betAmount: number): Promise<void> {
		await this.gamdomPage.clickContinueButton();
		await this.setBetAmountAndSpin(betAmount);
	}
}
