import { BasePageStep } from "@pages/base/base-page-step";
import { KenoGamePage } from "./keno-game-page";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import {
	getFormattedMultiplier,
	parseMultiplier,
	waitUntil,
} from "@core/utils/utils";
import {
	calculateBalanceAfterProfit,
	calculateBetAmountWithPercentage,
} from "@formulas/betting-calculations";
import { expect } from "@playwright/test";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class KenoGamePageSteps extends BasePageStep<KenoGamePage> {
	public constructor(gamdomPage: KenoGamePage) {
		super(gamdomPage);
	}

	@step("Start autobet")
	public async startAutobet(): Promise<void> {
		await this.gamdomPage.map.autobetSection.click();
		await this.gamdomPage.map.pickRandomTilesButton.click();
		await this.gamdomPage.map.startPlayingButton.click();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.stopPlayingButton]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([this.gamdomPage.map.betAmountInput]);
	}

	@step("Stop autobet")
	public async stopAutobet(): Promise<void> {
		await this.gamdomPage.map.stopPlayingButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.startPlayingButton]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreEnabled([this.gamdomPage.map.betAmountInput]);
	}

	@step("Start manual bet")
	public async startManualBet(
		betAmount: number | string,
		options?: { riskValue?: number },
	): Promise<void> {
		await this.gamdomPage.map.betAmountInput.fill(betAmount.toString());

		if (options?.riskValue !== undefined) {
			await this.gamdomPage.defineSliderValues(options.riskValue);
		}

		await this.gamdomPage.map.pickRandomTilesButton.click();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreEnabled([this.gamdomPage.map.startPlayingButton]);

		await this.gamdomPage.map.startPlayingButton.click();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([this.gamdomPage.map.startPlayingButton]);
	}

	@step("Configure bet amount and risk slider")
	public async configureBetAmountAndRiskSlider(
		betAmount: number,
		options?: { riskValue?: number },
	): Promise<void> {
		await this.gamdomPage.fillInBetAmount(betAmount);

		if (options?.riskValue) {
			await this.gamdomPage.defineSliderValues(options.riskValue);
		}
	}

	@step("Play Keno and try to win")
	public async playKenoUntilWin(
		betAmount: number,
		options?: {
			riskValue?: number;
			useAutoTileSelection?: boolean;
			numberOfTiles?: number;
		},
	): Promise<void> {
		await this.configureBetAmountAndRiskSlider(betAmount, {
			riskValue: options?.riskValue,
		});

		let isWin = false;
		while (!isWin) {
			const balanceBeforeBet = await this.prepareSingleKenoRound(
				options?.useAutoTileSelection,
				options?.numberOfTiles,
			);
			await this.executeSingleKenoRound();
			isWin = await this.handleKenoRoundResult(
				betAmount,
				balanceBeforeBet,
			);
		}
	}

	@step("Prepare single Keno round")
	private async prepareSingleKenoRound(
		useAutoTileSelection = false,
		numberOfTiles = 10,
	): Promise<number> {
		await this.gamdomPage.clearSelectedTiles();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([this.gamdomPage.map.startPlayingButton]);

		const balanceBeforeBet =
			await this.userBalanceHandler.walletBalanceInFiatRounded();

		if (useAutoTileSelection) {
			await this.gamdomPage.pickRandomTiles();
		} else {
			await this.gamdomPage.selectManuallyRandomKenoTiles(numberOfTiles);
		}

		await this.gamdomPage
			.assertThat()
			.checkElementsAreEnabled([this.gamdomPage.map.startPlayingButton]);

		return balanceBeforeBet;
	}

	@step("Execute single Keno round")
	private async executeSingleKenoRound(): Promise<void> {
		await this.gamdomPage.map.startPlayingButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreEnabled([this.gamdomPage.map.startPlayingButton]);
	}

	@step("Handle Keno round result")
	private async handleKenoRoundResult(
		betAmount: number,
		balanceBeforeBet: number,
	): Promise<boolean> {
		const isWin = await this.gamdomPage.assertThat().isWinDetected();

		if (isWin) {
			await this.handleWinResult(betAmount, balanceBeforeBet);
			return true;
		} else {
			await this.handleLossResult(betAmount, balanceBeforeBet);
			return false;
		}
	}

	@step("Handle win result")
	private async handleWinResult(
		betAmount: number,
		balanceBeforeBet: number,
	): Promise<void> {
		logger.info(`Win detected!`);
		const multiplier = await this.getWinMultiplier();
		const expectedBalance = calculateBalanceAfterProfit(
			balanceBeforeBet,
			betAmount,
			multiplier,
		);

		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(expectedBalance);
	}

	@step("Handle loss result")
	private async handleLossResult(
		betAmount: number,
		balanceBeforeBet: number,
	): Promise<void> {
		const expectedBalance = balanceBeforeBet - betAmount;
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(expectedBalance);
		logger.info(`Loss detected, trying again...`);
	}

	@step("Get multiplier from win banner")
	private async getWinMultiplier(): Promise<number> {
		const multiplierText =
			await this.gamdomPage.map.winMultiplier.textContent();

		expect(multiplierText).not.toBeNull();

		const multiplier = parseMultiplier(
			(multiplierText as string).trim(),
			getFormattedMultiplier({ isBig: true }),
		);

		return multiplier;
	}

	@step("Verify bet amount increased by percentage")
	public async verifyBetAmountIncreasedBy(
		previousBet: number,
		percentage: number,
	): Promise<number> {
		const actualBet = await this.gamdomPage.getBetAmountInputValue();
		const expectedBet = calculateBetAmountWithPercentage(
			previousBet,
			percentage,
		);
		expect(actualBet).toBeCloseTo(expectedBet, 1);
		return actualBet;
	}

	@step("Play autobet rounds until win and loss detected")
	public async playAutobetUntilWinAndLoss(
		betAmount: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		let hasWin = false;
		let hasLoss = false;
		let currentBet = betAmount;

		while (!hasWin || !hasLoss) {
			await this.gamdomPage.map.startPlayingButton.click();
			await this.gamdomPage.assertThat().startPlayingButtonIsEnabled();

			const isWin = await this.gamdomPage.assertThat().isWinDetected();

			if (isWin && !hasWin) {
				logger.info("First win detected");
				hasWin = true;
			} else if (!isWin && !hasLoss) {
				logger.info("First loss detected");
				hasLoss = true;
			}

			if (hasWin || hasLoss) {
				currentBet = await this.updateBetAmount(
					currentBet,
					isWin,
					onWinPercentage,
					onLossPercentage,
				);
			}
		}
	}

	@step("Update bet amount based on win/loss")
	private async updateBetAmount(
		currentBet: number,
		isWin: boolean,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<number> {
		const percentage = isWin ? onWinPercentage : onLossPercentage;

		await waitUntil(
			async () => {
				const value = await this.gamdomPage.getBetAmountInputValue();
				return currentBet != value;
			},
			{
				errorMessage: `Bet amount did not change from ${currentBet}`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.FIVE,
			},
		);

		return this.verifyBetAmountIncreasedBy(currentBet, percentage);
	}
}
