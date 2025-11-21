import { GameRoundResult, PlayUntilWonOptions } from "@core/interfaces";
import { waitUntil } from "@core/utils/utils";
import {
	BaccaratBetSpot,
	BaccaratChipValue,
} from "@enums/baccarat-game-options";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { testData } from "test-data/test-data-manager";
import { LiveBaccaratSqueezePage } from "./live-baccarat-squeeze-page";

export class LiveBaccaratSqueezePageSteps extends BasePageStep<LiveBaccaratSqueezePage> {
	public constructor(gamdomPage: LiveBaccaratSqueezePage) {
		super(gamdomPage);
	}

	@step("Handle screen name popup if displayed")
	public async handleScreenNamePopupIfDisplayed(): Promise<void> {
		try {
			await waitUntil(
				() => this.gamdomPage.map.screenNamePopup.isVisible(),
				{
					errorMessage: "Screen name popup did not appear",
					intervalSeconds: TimeoutSeconds.ONE,
					timeoutSeconds: TimeoutSeconds.TEN,
				},
			);
			await this.gamdomPage.steps().fillScreenNameAndClosePopup();
		} catch {
			logger.info("Screen name popup did not appear, continuing...");
		}
	}

	@step("Game is loaded")
	public async gameIsLoaded(): Promise<void> {
		await this.handleScreenNamePopupIfDisplayed();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible(
				[
					this.gamdomPage.map.footerContainer,
					this.gamdomPage.map.topCornerGradient,
				],
				Timeout.EXTRA_LONG,
			);
	}

	@step("Fill screen name and close popup")
	public async fillScreenNameAndClosePopup(
		screenName?: string,
	): Promise<void> {
		screenName =
			screenName ?? testData().fromRandom().data.casinoGames.playerName();
		const screenNameInput = this.gamdomPage.map.screenNameInput;
		await expect(screenNameInput).toBeVisible();
		await screenNameInput.fill(screenName);
		await this.gamdomPage.map.screenNameSaveButton.click();
	}

	@step("Place bet on {betSpot}")
	public async placeBetOnSpot(
		betSpot: BaccaratBetSpot,
		betAmount: BaccaratChipValue,
	): Promise<void> {
		await this.gamdomPage.map.getChip(betAmount).click();
		await this.gamdomPage.map.getBetSpot(betSpot).click();
		logger.info(`Placed bet of ${betAmount} on ${betSpot}`);
	}

	@step("Place bets on multiple spots")
	public async placeBetsOnMultipleSpots(
		betSpots: BaccaratBetSpot[],
		betAmount: number,
	): Promise<void> {
		for (const betSpot of betSpots) {
			await this.placeBetOnSpot(betSpot, betAmount);
		}
	}

	@step("Play until won and get results")
	public async playUntilWonAndGetResults(
		options: PlayUntilWonOptions,
	): Promise<GameRoundResult[]> {
		const results: GameRoundResult[] = [];
		const betSpots = Array.isArray(options.betSpots)
			? options.betSpots
			: [options.betSpots];
		const maxAttempts = options.maxAttempts ?? 10;
		let hasWon = false;
		let attempts = 0;

		while (!hasWon && attempts < maxAttempts) {
			attempts++;
			logger.info(`Starting game round ${attempts}`);

			await this.gamdomPage.assertThat().gameReadyToStart();

			await this.gamdomPage
				.assertThat()
				.checkElementsAreVisible([
					this.gamdomPage.map.bettingGridContainer,
				]);

			await this.placeBetsOnMultipleSpots(betSpots, options.betAmount);

			await this.gamdomPage.assertThat().gameRoundResultAppeared();

			const result = await this.gamdomPage
				.assertThat()
				.verifyGameRoundResultAndGetWinningAmount(betSpots);

			const isWin = betSpots.some(
				(spot) => spot.toUpperCase() === result.winner,
			);

			const roundResult: GameRoundResult = {
				won: isWin && result.amount !== "0" && result.amount !== "",
				amount: result.amount,
				betSpot: result.winner as BaccaratBetSpot,
			};

			results.push(roundResult);

			if (roundResult.won) {
				hasWon = true;
				logger.info(
					`Won after ${attempts} round(s) with amount: ${result.amount}`,
				);
			} else {
				logger.info(`Round ${attempts} was a loss, retrying...`);
			}
		}

		if (!hasWon) {
			logger.warn(
				`Did not win after ${maxAttempts} attempts, returning results`,
			);
		}

		return results;
	}
}
