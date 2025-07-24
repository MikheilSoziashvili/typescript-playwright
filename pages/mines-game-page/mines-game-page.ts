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
import { expect, Page, TestInfo } from "@playwright/test";
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

	@step("Navigate and wait for game to load")
	public async navigateAndWaitForGameToLoad(): Promise<void> {
		await this.navigate();
		await expect(this.map.startPlayingButton).toBeVisible({
			timeout: Timeout.MEDIUM,
		});
	}

	@step("Insert bet amount")
	public async insertBet(betAmount: number): Promise<void> {
		await this.map.betField.click();
		await this.map.betField.clear();
		await this.map.betField.pressSequentially(`${betAmount}`);
	}

	@step("Choose number of mines")
	public async chooseMinesNumber(minesNumber: number): Promise<void> {
		const slider = this.map.minesNumberSlider;
		await slider.focus();
		for (let i = 0; i < minesNumber; i++) {
			await slider.press("ArrowRight");
		}
	}

	@step("Get number of mines")
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

	@step("Get safe tiles count")
	private async getSafeTilesCount(): Promise<number> {
		return this.map.safeTiles.count();
	}

	@step("Get total safe tiles")
	private async getTotalSafeTiles(): Promise<number> {
		const numberOfMines = await this.getNumberOfMines();
		const totalSafeTiles =
			(await this.map.allTiles.count()) - numberOfMines;
		return totalSafeTiles;
	}

	@step("Start first round")
	public async startFirstRound(
		betAmount: number,
	): Promise<{ updatedTotal: number; updatedAttempts: number }> {
		await this.map.startPlayingButton.click();
		const updatedTotal = betAmount;
		const updatedAttempts = 1;
		return { updatedTotal, updatedAttempts };
	}

	@step("Wait for bomb or safe tile reveal")
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

	@step("Click tile and evaluate result")
	private async clickTileAndEvaluateResult(totalSafeTiles: number): Promise<{
		isGameWon: boolean;
		isBombVisible: boolean;
		currentSafeTilesCount: number;
	}> {
		const safeBefore = await this.getSafeTilesCount();
		await this.map.pickRandomTileButton.click();

		const safeAfter = await this.getSafeTilesCount();
		if (safeAfter > safeBefore) {
			expect(
				safeAfter,
				`Expected safe tiles after click to be exactly one more than before. Before: ${safeBefore}, After: ${safeAfter}`,
			).toBe(safeBefore + 1);
		}
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

	@step("Handle bomb loss")
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

	private hasReachedTimeout(startTime: number, timeoutMs: number): boolean {
		return Date.now() - startTime > timeoutMs;
	}

	@step("Pick random tiles and try to win")
	public async pickRandomTilesUntilWin(
		betAmount: number,
		testInfo: TestInfo,
	): Promise<number> {
		let totalAmountSpent = 0;
		let betAttempts = 0;
		let isBetWon = false;
		logger.info("Starting a new round and placing a bet...");

		const timeoutMs = Timeout.ULTRA_MAX;
		const startTime = Date.now();

		const checkTimeout = (): boolean => {
			const reached = this.hasReachedTimeout(startTime, timeoutMs);
			if (reached) {
				logger.warn("Timeout reached");
			}
			return reached;
		};

		({ updatedTotal: totalAmountSpent, updatedAttempts: betAttempts } =
			await this.startFirstRound(betAmount));

		while (!isBetWon) {
			if (checkTimeout()) {
				break;
			}

			let gameEnded = false;
			const totalSafeTiles = await this.getTotalSafeTiles();
			while (!gameEnded) {
				if (checkTimeout()) {
					break;
				}

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

		if (checkTimeout()) {
			testInfo.skip(
				true,
				`Skipping test — did not win within ${timeoutMs / 1000}s`,
			);
		}

		logger.info(`Game won after ${betAttempts} attempt(s)`);
		return totalAmountSpent;
	}

	@step("Perform manual cashout")
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

	@step("Place initial bet")
	private async placeInitialBet(betAmount: number): Promise<number> {
		const { updatedTotal } = await this.startFirstRound(betAmount);
		return updatedTotal;
	}

	@step("Play until round ends")
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

	@step("Press min button")
	public async pressMinButton(): Promise<void> {
		await this.map.minButton.click();
	}

	@step("Press half button")
	public async pressHalfButton(): Promise<void> {
		await this.map.halfButton.click();
	}

	@step("Press max button")
	public async pressMaxButton(): Promise<void> {
		await this.map.maxButton.click();
	}

	@step("Press double button")
	public async pressDoubleButton(): Promise<void> {
		await this.map.doubleButton.click();
	}

	@step("Get bet amount value")
	public async getBetAmountValue(): Promise<string> {
		return this.map.betField.inputValue();
	}

	@step("Open game history")
	public async openGameHistory(): Promise<void> {
		await this.map.gameHistoryButton.click();
	}

	@step("Get random game history row index")
	public async getRandomGameHistoryRowIndex(): Promise<number> {
		const rows = await this.map.gameHistoryTableRows.count();
		expect(rows, `No game history rows found`).toBeGreaterThan(0);
		return Math.floor(Math.random() * rows);
	}

	@step("Open bet details in Game History")
	public async openBetDetails(betRowIndex: number): Promise<void> {
		await this.map.gameHistoryTableRowByIndex(betRowIndex).click();
	}

	@step("Open Autobet tab")
	public async openAutobetTab(): Promise<void> {
		await this.map.autobetTab.click();
	}

	@step("Configure increase by percentage on win and on loss")
	public async configureAutobetIncreaseBy(
		autobetsNumber: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		await this.map.autoBetsCountInput.click();
		await this.map.autoBetsCountInput.fill(autobetsNumber.toString());
		await this.map.onWinIncreaseByInput.click();
		await this.map.onWinIncreaseByInput.fill(onWinPercentage.toString());
		await this.map.onLossIncreaseByInput.click();
		await this.map.onLossIncreaseByInput.fill(onLossPercentage.toString());
	}

	@step("Click on Auto Bet Random Tile button")
	public async clickOnAutoBetRandomTileButton(): Promise<void> {
		await this.map.autoBetRandomTileButton.click();
		await this.isBetAmountFieldDisabled();
	}

	@step("Start Autobet")
	public async startAutobet(): Promise<void> {
		await this.map.startAutobetButton.click();
	}

	@step("Execute single autobet round")
	public async executeSingleAutobetRound(): Promise<{
		isBombCaught: boolean;
		isWin: boolean;
	}> {
		await this.map.startAutobetButton.click();
		return this.waitForAutobetRoundResult();
	}

	@step("Wait for autobet round result")
	public async waitForAutobetRoundResult(): Promise<{
		isBombCaught: boolean;
		isWin: boolean;
	}> {
		await waitUntil(
			async () => {
				const { bombVisible, winVisible, startDisabled } =
					await this.getAutobetRoundStatus();

				return (bombVisible || winVisible) && startDisabled;
			},
			{
				errorMessage:
					"Failed to determine autobet round result in time",
				timeoutSeconds: Timeout.SHORT,
			},
		);

		const { bombVisible: isBombCaught, winVisible: isWinVisible } =
			await this.getAutobetRoundStatus();

		const isWin = !isBombCaught && isWinVisible;

		logger.info(
			`Autobet round result - Bomb: ${isBombCaught}, Win: ${isWin}`,
		);

		return { isBombCaught, isWin };
	}

	@step("Calculate bet amount with percentage")
	public async calculateBetAmountWithPercentage(
		currentAmount: number,
		percentage: number,
	): Promise<number> {
		return parseFloat((currentAmount * (1 + percentage / 100)).toFixed(2));
	}

	@step("Is bet amount field disabled?")
	public async isBetAmountFieldDisabled(): Promise<void> {
		const betAmountField = this.map.betField;
		await expect(betAmountField).toBeDisabled();
	}

	@step("Get Autobet round status")
	private async getAutobetRoundStatus(): Promise<{
		bombVisible: boolean;
		winVisible: boolean;
		startDisabled: boolean;
	}> {
		const [bombVisible, winVisible, startDisabled] = await Promise.all([
			this.map.bombTile.isVisible(),
			this.map.winImage.isVisible(),
			this.map.startAutobetButton.isDisabled(),
		]);

		return { bombVisible, winVisible, startDisabled };
	}
}
