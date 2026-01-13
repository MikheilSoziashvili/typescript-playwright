import { BaseAsserter } from "@base/base-asserter";
import { PopUpButtons } from "@enums/popup-buttons";
import { Timeout } from "@enums/timeout";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { BookOfArabiaPage } from "./book-of-arabia-page";
import { logger } from "@logger/logger";
import { freeSpinsMessagePattern } from "@support/regex-patterns";

export class BookOfArabiaPageAsserter extends BaseAsserter<BookOfArabiaPage> {
	public constructor(page: BookOfArabiaPage) {
		super(page);
	}

	@step("Check spin button is spinning")
	public async spinButtonIsSpinning(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.spinButtonSpinning],
			Timeout.LONG,
			"Spin button is not spinning. Round is not yet started.",
		);
	}

	@step("Check spin button is idle")
	public async spinButtonIsIdle(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.spinButtonIdle],
			Timeout.LONG,
			"Spin button is not idle. Round is not yet finished.",
		);
	}

	@step("Check continue button is visible")
	public async continueButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.continueButton],
			Timeout.LONG,
			"Continue button is not visible.",
		);
	}

	@step("Verify free spins popup and start game (configurable)")
	async verifyFreeSpinsPopupAndStart(
		expectedSpins: number,
		options?: { expectedBet?: number; skipContinue?: boolean },
	): Promise<void> {
		const { expectedBet, skipContinue = false } = options ?? {};

		if (!skipContinue) {
			await this.gamdomPage.clickContinueButton();
		}

		const popUp = this.gamdomPage.map.popUpContainer;
		await expect(popUp).toBeVisible();

		const popUpButton = this.gamdomPage.map.popUpButton(PopUpButtons.START);
		const elementsToCheck = [
			popUp,
			popUp.getByText(freeSpinsMessagePattern(expectedSpins)),
		];
		if (expectedBet) {
			elementsToCheck.push(
				popUp.getByText(`$${expectedBet}`, { exact: false }),
			);
		}
		await this.checkElementsAreVisible(elementsToCheck);
		await popUpButton.click();
	}

	@step("Verify free spins result popup and click Continue")
	async verifyFreeSpinsResultAndContinue(
		expectedSpins: number,
	): Promise<void> {
		const resultPopup = this.gamdomPage.map.popUpContainer;

		await this.checkElementsAreVisible([
			resultPopup,
			resultPopup.getByText(`You have played ${expectedSpins} spin`, {
				exact: false,
			}),
		]);

		const continueButton = this.gamdomPage.map.popUpButton(
			PopUpButtons.CONTINUE,
		);
		await continueButton.click();
	}

	@step("Ensure game is loaded, retry up to 5 times if necessary")
	async ensureGameLoaded(maxRetries = 5): Promise<void> {
		const iframe = this.gamdomPage.map.outerFrameElement;
		const continueButton = this.gamdomPage.map.continueButton;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				await this.checkElementsAreVisible(
					[iframe, continueButton],
					Timeout.LONG,
				);
				return;
			} catch {
				if (attempt === maxRetries) {
					logger.error("Game failed to load after maximum retries.");
					throw new Error(
						"Game failed to load after multiple refresh attempts.",
					);
				}

				logger.warn(
					`Game not loaded (attempt ${attempt}), refreshing page...`,
				);
				await this.gamdomPage.refresh();
			}
		}
	}

	@step("Check if win label is visible")
	public async isWinLabelVisible(): Promise<boolean> {
		return this.isElementVisible([this.gamdomPage.map.winLabel]);
	}
}
