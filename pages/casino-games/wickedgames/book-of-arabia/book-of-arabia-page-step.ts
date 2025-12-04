import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { BookOfArabiaPage } from "./book-of-arabia-page";
import { logger } from "@logger/logger";
import { PopUpButtons } from "@enums/popup-buttons";
import { VisibilityState } from "@enums/playwright/visibility-states";

export class BookOfArabiaPageSteps extends BasePageStep<BookOfArabiaPage> {
	public constructor(gamdomPage: BookOfArabiaPage) {
		super(gamdomPage);
	}

	@step("Set bet amount")
	public async setBetAmount(amount: number): Promise<void> {
		await this.gamdomPage.map.betContainer.click();
		await this.gamdomPage.map.betOptionsRoot.waitFor({ state: "visible" });

		await this.gamdomPage.map.getBetOption(amount).click();
	}

	@step("Set bet amount and spin")
	public async setBetAmountAndSpin(amount: number): Promise<void> {
		await this.setBetAmount(amount);
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
		await this.gamdomPage.assertThat().spinButtonIsIdle();
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

	@step("Spin until won")
	public async spinUntilWon(betAmount: number): Promise<void> {
		let hasWon = false;
		let spinCount = 0;

		await this.gamdomPage.clickContinueButton();
		await this.setBetAmount(betAmount);
		while (!hasWon) {
			await this.spinAndWait();
			spinCount++;

			const isWon = await this.gamdomPage
				.assertThat()
				.isWinLabelVisible();

			if (isWon) {
				hasWon = true;
				logger.info(`Won after ${spinCount} spin(s)`);
			}
		}
	}

	@step("Handle unexpected free spins popup if it appears")
	public async handleUnexpectedFreeSpinsPopup(): Promise<void> {
		const popup = this.gamdomPage.map.popUpContainer;
		const popupVisible = await popup.isVisible();

		if (!popupVisible) {
			return;
		}

		await this.gamdomPage.map.popUpButton(PopUpButtons.OPT_OUT).click();
		await popup.waitFor({ state: VisibilityState.HIDDEN });
	}
}
