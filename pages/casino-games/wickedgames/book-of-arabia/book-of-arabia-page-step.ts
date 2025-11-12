import { Timeout } from "@enums/timeout";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { BookOfArabiaPage } from "./book-of-arabia-page";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";

export class BookOfArabiaPageSteps extends BasePageStep<BookOfArabiaPage> {
	public constructor(gamdomPage: BookOfArabiaPage) {
		super(gamdomPage);
	}

	@step("Set bet amount and spin")
	public async setBetAmountAndSpin(amount: number): Promise<void> {
		await this.gamdomPage.map.betContainer.click();
		await this.gamdomPage.map.betOptionsRoot.waitFor({ state: "visible" });

		await this.gamdomPage.map.getBetOption(amount).click();
		await this.spinAndWait();
	}

	@step("Start game and spin with bet")
	public async startGameAndSpin(betAmount: number): Promise<void> {
		await this.gamdomPage.clickContinueButton();
		await this.setBetAmountAndSpin(betAmount);
	}

	@step("Spin and wait for round to finish")
	public async spinAndWait(): Promise<void> {
		await this.gamdomPage.clickSpinButton();
		const spinButtonText = this.gamdomPage.map.spinButtonText;
		await this.gamdomPage
			.assertThat()
			.expectElementToHaveClass(
				spinButtonText,
				AttributesValues.IDLE,
				Timeout.LONG,
			);
	}

	@step("Play all available free spins")
	async playAllAvailableFreeSpins(
		expectedRounds: number,
		expectedSpins: number,
	): Promise<void> {
		await this.gamdomPage.clickContinueButton();

		for (let round = 1; round <= expectedRounds; round++) {
			await this.gamdomPage
				.assertThat()
				.verifyFreeSpinsPopupAndStart(expectedSpins, {
					skipContinue: true,
				});

			await this.gamdomPage.clickSpinButton();

			await this.gamdomPage
				.assertThat()
				.verifyFreeSpinsResultAndContinue(expectedSpins);
		}
	}

	@step("Ensure game is loaded and perform a spin")
	public async ensureLoadedAndSpin(betAmount: number): Promise<void> {
		await this.gamdomPage.assertThat().ensureGameLoaded();
		await this.gamdomPage.steps().startGameAndSpin(betAmount);
	}
}
