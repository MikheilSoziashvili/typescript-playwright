import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { MinesGamePage } from "./mines-game-page";
import { MinesBetTestData } from "@dtos/test-data";
import { logger } from "@logger/logger";
import { calculateBetAmountWithPercentage } from "@formulas/betting-calculations";

export class MinesGamePageSteps extends BasePageStep<MinesGamePage> {
	public constructor(gamdomPage: MinesGamePage) {
		super(gamdomPage);
	}

	@step("Place bet and configure mines")
	public async placeBetAndConfigureMines(
		minesBetData: MinesBetTestData,
	): Promise<void> {
		await this.gamdomPage.assertThat().insertBetFieldIsDisplayed();
		await this.gamdomPage.insertBet(minesBetData.betAmount);
		await this.gamdomPage.chooseMinesNumber(minesBetData.minesNumber);
	}

	@step("Place manual bet with random tile")
	public async placeManualBetWithRandomTile(
		minesBetData: MinesBetTestData,
	): Promise<void> {
		await this.placeBetAndConfigureMines(minesBetData);
		await this.gamdomPage.startFirstRound(minesBetData.betAmount);
		await this.gamdomPage.performReliableClick(
			this.gamdomPage.map.pickRandomTileButton,
		);
	}

	@step("Perform manual cashout")
	public async performManualCashout(): Promise<void> {
		await this.gamdomPage.assertThat().manualCashoutButtonIsDisplayed();
		await this.gamdomPage.performManualCashout();
	}

	@step("Verify bet is shown in the game history")
	public async verifyBetIsShownInGameHistory(): Promise<void> {
		await this.gamdomPage.openGameHistory();
		await this.gamdomPage.assertThat().verifyGameHistoryModalIsOpened();

		const betRowIndex =
			await this.gamdomPage.getRandomGameHistoryRowIndex();
		const rowBetAmount = await this.gamdomPage.map
			.gameHistoryTableRowBetAmount(betRowIndex)
			.innerText();

		await this.gamdomPage.openBetDetails(betRowIndex);
		await this.gamdomPage.assertThat().verifyBetDetailsModalIsOpened();

		await this.gamdomPage
			.assertThat()
			.verifyBetAmountIsDisplayedInBetDetailsModal(rowBetAmount);
	}

	@step("Configure Autobet for Increase By")
	public async configureAutobetForIncreaseBy(
		minesBetData: MinesBetTestData,
		autobetsNumber: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		await this.gamdomPage.openAutobetTab();
		await this.gamdomPage.insertBet(minesBetData.betAmount);
		await this.gamdomPage.chooseMinesNumber(minesBetData.minesNumber);
		await this.gamdomPage.configureAutobetIncreaseBy(
			autobetsNumber,
			onWinPercentage,
			onLossPercentage,
		);
	}

	@step("Open and configure Autobet")
	public async openAndConfigureAutobet(
		minesBetData: MinesBetTestData,
		autobetsNumber: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		await this.gamdomPage.openAutobetTab();
		await this.gamdomPage.insertBet(minesBetData.betAmount);
		await this.gamdomPage.chooseMinesNumber(minesBetData.minesNumber);
		await this.gamdomPage.configureAutobetIncreaseBy(
			autobetsNumber,
			onWinPercentage,
			onLossPercentage,
		);
		await this.gamdomPage.map.autoBetRandomTileButton.click();
	}

	@step(
		"Pick random tiles until bomb caught (Autobet with bet amount tracking)",
	)
	public async pickRandomTilesUntilBombCaughtAutobet(
		betAmount: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<{
		totalBetsPlaced: number;
		hasWonAtLeastOnce: boolean;
		betAmountHistory: number[];
		winningBets: number[];
	}> {
		let totalBetsPlaced = 0;
		let hasWonAtLeastOnce = false;
		let isBombCaught = false;
		let currentBetAmount = betAmount;
		const betAmountHistory: number[] = [];
		const winningBets: number[] = [];
		let roundCount = 0;
		const maxRounds = 25;

		while (
			(!hasWonAtLeastOnce || !isBombCaught) &&
			roundCount < maxRounds
		) {
			roundCount++;
			logger.info(`=== ROUND ${roundCount} ===`);

			betAmountHistory.push(currentBetAmount);
			totalBetsPlaced += currentBetAmount;

			const roundResult =
				await this.gamdomPage.executeSingleAutobetRound();

			const bombResult = await this.handleBombCaught(
				roundResult.isBombCaught,
				hasWonAtLeastOnce,
				betAmount,
				currentBetAmount,
				onLossPercentage,
			);
			isBombCaught = bombResult.isBombCaught;
			currentBetAmount = bombResult.currentBetAmount;
			if (bombResult.shouldContinue) continue;

			const winResult = await this.handleWin(
				roundResult.isWin,
				hasWonAtLeastOnce,
				currentBetAmount,
				onWinPercentage,
				winningBets,
			);
			hasWonAtLeastOnce = winResult.hasWonAtLeastOnce;
			currentBetAmount = winResult.currentBetAmount;
		}

		logger.info(
			`Autobet finished. Total bets: ${totalBetsPlaced}, Won at least once: ${hasWonAtLeastOnce}, Rounds: ${roundCount}`,
		);

		return {
			totalBetsPlaced,
			hasWonAtLeastOnce,
			betAmountHistory,
			winningBets,
		};
	}

	@step("Handle case when bomb is caught in Autobet")
	private async handleBombCaught(
		isBombCaught: boolean,
		hasWonAtLeastOnce: boolean,
		betAmount: number,
		currentBetAmount: number,
		onLossPercentage: number,
	): Promise<{
		isBombCaught: boolean;
		currentBetAmount: number;
		shouldContinue: boolean;
	}> {
		if (!isBombCaught) {
			return {
				isBombCaught: false,
				currentBetAmount: currentBetAmount,
				shouldContinue: false,
			};
		}

		logger.warn("Bomb caught in autobet round");

		if (!hasWonAtLeastOnce) {
			logger.info(
				"No wins yet, restarting autobet to ensure at least one win...",
			);
			await this.gamdomPage.insertBet(betAmount);
			return {
				isBombCaught: false,
				currentBetAmount: betAmount,
				shouldContinue: true,
			};
		} else {
			const nextBetAmount = calculateBetAmountWithPercentage(
				currentBetAmount,
				onLossPercentage,
			);
			logger.info(`Next bet amount after loss: ${nextBetAmount}`);
			await this.gamdomPage
				.assertThat()
				.verifyBetAmountInField(nextBetAmount);
			return {
				isBombCaught: true,
				currentBetAmount: nextBetAmount,
				shouldContinue: false,
			};
		}
	}

	@step("Handle case when win is detected in Autobet")
	private async handleWin(
		isWin: boolean,
		hasWonAtLeastOnce: boolean,
		currentBetAmount: number,
		onWinPercentage: number,
		winningBets: number[],
	): Promise<{ hasWonAtLeastOnce: boolean; currentBetAmount: number }> {
		if (!isWin) {
			return { hasWonAtLeastOnce, currentBetAmount };
		}

		logger.info("Win detected in autobet round");
		winningBets.push(currentBetAmount);

		const nextBetAmount = calculateBetAmountWithPercentage(
			currentBetAmount,
			onWinPercentage,
		);
		logger.info(`Next bet amount after win: ${nextBetAmount}`);
		await this.gamdomPage
			.assertThat()
			.verifyBetAmountInField(nextBetAmount);

		return { hasWonAtLeastOnce: true, currentBetAmount: nextBetAmount };
	}
}
