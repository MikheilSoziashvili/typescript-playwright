import { MINES_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import {
	roundToDecimals,
	truncateToDecimals,
	waitUntil,
} from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { BasePage } from "@pages/base/base-page";
import { expect, Page } from "@playwright/test";
import { step } from "decorators/step";
import { MinesGamePageAsserter } from "./mines-game-page-asserter";
import { MinesGamePageMap } from "./mines-game-page-map";
import { MinesGamePageSteps } from "./mines-game-page-steps";

export class MinesGamePage extends BasePage<MinesGamePageMap> {
	public constructor(page: Page) {
		super(page, new MinesGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [MINES_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): MinesGamePageAsserter {
		return new MinesGamePageAsserter(this);
	}

	public steps(): MinesGamePageSteps {
		return new MinesGamePageSteps(this);
	}

	public async navigateAndWaitForGameToLoad(): Promise<void> {
		await this.navigate();
		await expect(this.map.startPlayingButton).toBeVisible({
			timeout: Timeout.MEDIUM,
		});
	}

	public async insertBet(betAmount: number): Promise<void> {
		await this.map.betField.click();
		await this.map.betField.clear();
		await this.map.betField.pressSequentially(`${betAmount}`);
	}

	public async chooseMinesNumber(minesNumber: number): Promise<void> {
		const slider = this.map.minesNumberSlider;
		for (let i = 0; i < minesNumber; i++) {
			await slider.press("ArrowRight");
		}
	}

	public async getNumberOfMines(): Promise<number> {
		const numberOfMinesText = await this.map.numberOfMines.innerText();
		return parseInt(numberOfMinesText, 10);
	}

	public calculateExpectedBalance(
		initialBalance: number,
		totalBets: number,
		winnings: number,
	): number {
		const rawBalance = initialBalance - totalBets + winnings;
		const roundedBalance = roundToDecimals(rawBalance, 2);
		const finalBalance = truncateToDecimals(roundedBalance, 1);
		logger.info(
			`Raw balance: ${rawBalance}, Rounded balance: ${roundedBalance}, Final balance: ${finalBalance}`,
		);
		return finalBalance;
	}

	public calculateWinnings(betAmount: number, multiplier: number): number {
		return betAmount * multiplier;
	}

	private async getSafeTilesCount(): Promise<number> {
		return this.map.safeTiles.count();
	}

	private async getTotalSafeTiles(): Promise<number> {
		const numberOfMines = await this.getNumberOfMines();
		const totalSafeTiles =
			(await this.map.allTiles.count()) - numberOfMines;
		return totalSafeTiles;
	}

	public async startFirstRound(
		betAmount: number,
	): Promise<{ updatedTotal: number; updatedAttempts: number }> {
		await this.map.startPlayingButton.click();
		const updatedTotal = betAmount;
		const updatedAttempts = 1;
		return { updatedTotal, updatedAttempts };
	}

	private async waitForBombOrSafeTileReveal(
		safeTilesCountBeforeClick: number,
	): Promise<void> {
		await waitUntil(
			async () => {
				const safeAfter = await this.getSafeTilesCount();
				const bombVisible = (await this.map.bombTile.count()) > 0;
				logger.info(
					`Safe after: ${safeAfter} | Bomb count: ${await this.map.bombTile.count()}`,
				);
				return bombVisible || safeAfter > safeTilesCountBeforeClick;
			},
			{
				errorMessage: "Failed to determine tile state in time",
				timeoutSeconds: Timeout.EXTRA_SHORT,
			},
		);
	}

	private async clickTileAndEvaluateResult(totalSafeTiles: number): Promise<{
		isGameWon: boolean;
		isBombVisible: boolean;
		currentSafeTilesCount: number;
	}> {
		const safeBefore = await this.getSafeTilesCount();
		await this.map.pickRandomTileButton.click();

		const safeAfter = await this.getSafeTilesCount();
		if (this.isGameWon(safeAfter, totalSafeTiles)) {
			return {
				isGameWon: true,
				isBombVisible: false,
				currentSafeTilesCount: safeAfter,
			};
		}

		await this.waitForBombOrSafeTileReveal(safeBefore);
		const currentSafe = await this.getSafeTilesCount();
		const bombVisible = await this.map.bombTile.isVisible();

		return {
			isGameWon: this.isGameWon(currentSafe, totalSafeTiles),
			isBombVisible: bombVisible,
			currentSafeTilesCount: currentSafe,
		};
	}

	private isGameWon(safeRevealed: number, totalSafe: number): boolean {
		return safeRevealed === totalSafe;
	}

	private markGameAsWon(): { isBetWon: boolean; gameEnded: boolean } {
		return { isBetWon: true, gameEnded: true };
	}

	private async handleBombLoss(
		betAmount: number,
		currentTotal: number,
		attempts: number,
	): Promise<{ updatedTotal: number; updatedAttempts: number }> {
		logger.warn("Bomb hit! Restarting round...");
		await this.map.startPlayingButton.click();

		const updatedTotal = currentTotal + betAmount;
		const updatedAttempts = attempts + 1;

		logger.info(`Total amount spent = ${updatedTotal}`);
		return { updatedTotal, updatedAttempts };
	}

	@step("Pick random tiles and try to win")
	public async pickRandomTilesUntilWin(betAmount: number): Promise<number> {
		let totalAmountSpent = 0;
		let betAttempts = 0;
		let isBetWon = false;

		logger.info("Starting a new round and placing a bet...");

		({ updatedTotal: totalAmountSpent, updatedAttempts: betAttempts } =
			await this.startFirstRound(betAmount));

		while (!isBetWon) {
			let gameEnded = false;

			const totalSafeTiles = await this.getTotalSafeTiles();

			while (!gameEnded) {
				const { isGameWon, isBombVisible, currentSafeTilesCount } =
					await this.clickTileAndEvaluateResult(totalSafeTiles);

				if (isGameWon) {
					({ isBetWon, gameEnded } = this.markGameAsWon());
					continue;
				}

				if (isBombVisible) {
					({
						updatedTotal: totalAmountSpent,
						updatedAttempts: betAttempts,
					} = await this.handleBombLoss(
						betAmount,
						totalAmountSpent,
						betAttempts,
					));
				} else if (
					this.isGameWon(currentSafeTilesCount, totalSafeTiles)
				) {
					({ isBetWon, gameEnded } = this.markGameAsWon());
				}
			}
		}
		logger.info(`Game won after ${betAttempts} attempt(s)`);
		return totalAmountSpent;
	}

	public async performManualCashout(): Promise<void> {
		await this.map.manualCashoutButton.click();
	}

	@step("Pick random tiles until a bomb is caught")
	public async pickRandomTilesUntilBombIsCaught(
		betAmount: number,
	): Promise<{ totalBetsPlaced: number; hasWonAtLeastOnce: boolean }> {
		let totalBetsPlaced = 0;
		let hasWonAtLeastOnce = false;
		let isBombCaught = false;

		while (!isBombCaught) {
			totalBetsPlaced += await this.placeInitialBet(betAmount);
			const totalSafeTiles = await this.getTotalSafeTiles();
			const result = await this.playUntilRoundEnds(totalSafeTiles);

			isBombCaught = result.isBombCaught;
			hasWonAtLeastOnce ||= result.hasWon;
		}

		logger.info(
			`Finished loop. Total bets placed: ${totalBetsPlaced}, Has won: ${hasWonAtLeastOnce}`,
		);

		return { totalBetsPlaced, hasWonAtLeastOnce };
	}

	private async placeInitialBet(betAmount: number): Promise<number> {
		const { updatedTotal } = await this.startFirstRound(betAmount);
		return updatedTotal;
	}

	private async playUntilRoundEnds(
		totalSafeTiles: number,
	): Promise<{ isBombCaught: boolean; hasWon: boolean }> {
		while (true) {
			const { isGameWon, isBombVisible, currentSafeTilesCount } =
				await this.clickTileAndEvaluateResult(totalSafeTiles);

			if (isBombVisible) {
				logger.warn("Bomb caught. Ending test loop.");
				return { isBombCaught: true, hasWon: false };
			}

			if (
				isGameWon ||
				this.isGameWon(currentSafeTilesCount, totalSafeTiles)
			) {
				logger.info("Win detected.");
				return { isBombCaught: false, hasWon: true };
			}
		}
	}
}
