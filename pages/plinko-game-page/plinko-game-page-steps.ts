import {
	getFormattedMultiplier,
	parseBalance,
	parseMultiplier,
	waitUntil,
} from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import {
	PlinkoRiskOption,
	PlinkoRowsOption,
} from "@enums/plinko/plinko-game-options";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect, Locator } from "@playwright/test";
import { step } from "decorators/step";
import { PlinkoGamePage } from "./plinko-game-page";
import { logger } from "@logger/logger";
import { calculateBalanceAfterProfit } from "@formulas/betting-calculations";

export class PlinkoGamePageSteps extends BasePageStep<PlinkoGamePage> {
	public constructor(gamdomPage: PlinkoGamePage) {
		super(gamdomPage);
	}

	@step("Navigate to autobet successfully")
	public async navigateToAutobetSuccessfully(): Promise<void> {
		await this.gamdomPage.clickAutobet();
		await expect(this.gamdomPage.map.autoBetButton).toHaveAttribute(
			Attributes.DATA_STATE,
			AttributesValues.ACTIVE,
		);
	}

	@step("Enter number of bets")
	public async enterNumberOfBets(betsNumber: string): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.betCountsContainer]);
		await this.gamdomPage.map.numberOfBetsInput.fill(betsNumber);
	}

	@step("Start autobet successfully")
	public async startAutobetSuccessfully(): Promise<void> {
		await this.gamdomPage.assertThat().starAutobetButtonIsDisplayed();
		await this.gamdomPage.map.startAutobetButton.click();
		await this.gamdomPage.assertThat().stopAutobetButtonIsDisplayed();
	}

	@step("Stop autobet successfully")
	public async stopAutobetSuccessfully(): Promise<void> {
		await this.gamdomPage.assertThat().stopAutobetButtonIsDisplayed();
		await this.gamdomPage.map.stopAutobetButton.click();
		await this.gamdomPage.assertThat().starAutobetButtonIsDisplayed();
	}

	@step("Fetch remaining bets value")
	private async fetchRemainingBetsValue(): Promise<number> {
		const text =
			await this.gamdomPage.map.remainingBetsBalanceLabel.textContent();
		return text ? parseInt(text.trim(), 10) : NaN;
	}

	@step("Validate counter is decreasing")
	private async validateCounterIsDecreasing(
		current: number,
		previous: number,
	): Promise<void> {
		expect(
			current,
			`Counter did not decrease! Previous: ${previous}, Current: ${current}`,
		).toBeLessThan(previous);
	}

	@step("Ensure stop autobet button is visible")
	private async ensureStopAutobetButtonIsVisible(): Promise<void> {
		await expect(this.gamdomPage.map.stopAutobetButton).toBeVisible();
	}

	@step("Verify remaining bets decreasing")
	public async verifyRemainingBetsDecreasing(
		initialRemainingBets: string,
		expectTimeToFinishAutobet = TimeoutSeconds.THIRTY,
	): Promise<void> {
		const initialValue = parseInt(initialRemainingBets, 10);
		let previousValue = initialValue;
		let firstDecreaseObserved = false;
		const observedValues: number[] = [];

		await waitUntil(
			async () => {
				const counterValue = await this.fetchRemainingBetsValue();
				if (isNaN(counterValue)) {
					return false;
				}

				observedValues.push(counterValue);

				if (!firstDecreaseObserved) {
					if (counterValue < previousValue) {
						firstDecreaseObserved = true;
					} else {
						return false;
					}
				}

				await this.validateCounterIsDecreasing(
					counterValue,
					previousValue,
				);
				previousValue = counterValue;

				await this.ensureStopAutobetButtonIsVisible();

				return counterValue === previousValue;
			},
			{
				errorMessage:
					"Counter did not reach '1' within the expected time",
				intervalSeconds: 0.1,
				timeoutSeconds: expectTimeToFinishAutobet,
			},
		);
	}

	@step("Start manual bet with balance check")
	public async startManualBetWithBalanceCheck(
		betAmount: string,
		options?: {
			rowsValue?: number | PlinkoRowsOption;
			riskValue?: number | PlinkoRiskOption;
		},
	): Promise<void> {
		const initialInGameBalance =
			await this.gamdomPage.getUserInGameBalance();

		await this.gamdomPage.startManualBet(betAmount, options);

		await this.gamdomPage.assertThat().verifyRowsSliderInactive();
		await this.gamdomPage.assertThat().verifyRiskSliderInactive();

		const finalInGameBalance = await this.gamdomPage.getUserInGameBalance();
		expect(finalInGameBalance).toBe(
			initialInGameBalance - parseBalance(betAmount),
		);
	}

	@step("Adjust slider values")
	public async adjustSliderValues(options: {
		rowsValue?: number | PlinkoRowsOption;
		riskValue?: number | PlinkoRiskOption;
	}): Promise<void> {
		const sliderMap: Record<keyof typeof options, Locator> = {
			rowsValue: this.gamdomPage.map.betRowsSliderContainer,
			riskValue: this.gamdomPage.map.riskRowsSliderContainer,
		};

		for (const key of Object.keys(options) as (keyof typeof options)[]) {
			const value = options[key];
			if (value !== undefined) {
				await this.gamdomPage.adjustSliderValue(sliderMap[key], value);
			}
		}
	}

	@step("Wait for sliders to be active")
	public async waitForSlidersToBeActive(): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.verifyRowsSliderActive(Timeout.EXTRA_LONG);
		await this.gamdomPage
			.assertThat()
			.verifyRiskSliderActive(Timeout.EXTRA_LONG);
	}

	@step("Get in game chips history button value")
	public async getInGameChipsHistoryButtonValue(): Promise<number> {
		await this.gamdomPage.assertThat().verifyInGameHistoryIsDisplayed();
		await this.gamdomPage
			.assertThat()
			.verifyInGameChipsHistoryButtonIsDisplayed();

		const inGameChipsHistoryButtonText =
			await this.gamdomPage.map.inGameChipsHistoryButton.textContent();

		if (!inGameChipsHistoryButtonText) {
			throw new Error("In-game chips history button has no text content");
		}

		const multiplier = parseMultiplier(
			inGameChipsHistoryButtonText.trim(),
			getFormattedMultiplier({ isBig: true }),
		);

		return multiplier;
	}

	@step("Calculate the winnings")
	public async calculateWinnings(
		betAmount: number,
		multiplier: number,
	): Promise<number> {
		return betAmount * multiplier;
	}

	@step("Calculate expected balance after bet")
	public async calculateExpectedBalance(
		accountBalanceBeforeBet: number,
		betAmount: number,
		winnings: number,
	): Promise<number> {
		return accountBalanceBeforeBet - betAmount + winnings;
	}

	@step("Calculate total wagered in Plinko")
	public async calculateTotalWagered(betAmount: number, numberOfGames: number): Promise<string> {
		const total = `$${(betAmount * numberOfGames).toFixed(2)}`;
		logger.info(`Total wagered in Plinko: ${total}`);
		return total;
	}

	@step("Play multiple Plinko games and get balances")
	public async playMultipleGamesAndGetBalances(
		betAmount: number,
		numberOfGames: number,
	): Promise<number[]> {
		const balances: number[] = [];

		for (let i = 0; i < numberOfGames; i++) {
			await this.gamdomPage.startManualBet(betAmount.toString());
			await this.waitForSlidersToBeActive();

			const balanceAfterBet =
				await this.userBalanceHandler.walletBalanceInFiatRounded();
			balances.push(balanceAfterBet);
		}

		return balances;
	}

	@step("Play Plinko until win")
	public async playPlinkoUntilWin(
		betAmount: number,
		options?: {
			rowsValue?: number;
			riskValue?: number;
		},
	): Promise<void> {
		let multiplier = 0;
		const maxRounds = 50;
		let historyResultsCount = 0;

		await this.gamdomPage.fillInBetAmount(betAmount.toString());
		await this.gamdomPage.defineSliderValues(options);

		let previousHistoryCount = await this.getHistoryButtonsCount();

		while (historyResultsCount < maxRounds) {
			historyResultsCount++;

			if (previousHistoryCount === 10) {
				logger.info(
					"Maximum history count reached (10), refreshing page...",
				);
				await this.refreshPageAndSetupBet(betAmount, options);
				previousHistoryCount = 0;
			}

			const accountBalanceBeforeBet =
				await this.userBalanceHandler.walletBalanceInFiatRounded();

			const newHistoryResult = await this.waitForNewPlinkoResult(
				previousHistoryCount,
			);

			previousHistoryCount = await this.getHistoryButtonsCount();

			const isWin = newHistoryResult > 1.0;

			const expectedBalance = calculateBalanceAfterProfit(
				accountBalanceBeforeBet,
				betAmount,
				newHistoryResult,
			);

			logger.info(
				`Balance before: ${accountBalanceBeforeBet}, Expected after: ${expectedBalance}`,
			);

			await this.gamdomPage.authenticatedHeader
				.assertThat()
				.accountBalanceIs(expectedBalance);

			if (isWin) {
				multiplier = newHistoryResult;
				logger.info(`Win detected with multiplier: ${multiplier}x`);
				break;
			} else {
				logger.info(
					`Loss detected with multiplier: ${multiplier}x - continuing...`,
				);
			}
		}
	}

	@step("Wait for new Plinko result")
	public async waitForNewPlinkoResult(
		previousHistoryCount: number,
	): Promise<number> {
		logger.info(
			`Waiting for history count to increase from ${previousHistoryCount}`,
		);

		await this.gamdomPage.map.dropBallButton.click();
		await waitUntil(
			async () => {
				const currentCount = await this.getHistoryButtonsCount();
				logger.info(
					`Waiting for count increase: ${currentCount} > ${previousHistoryCount}`,
				);
				return currentCount > previousHistoryCount;
			},
			{
				errorMessage: `History count did not increase from ${previousHistoryCount} after dropping ball.`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.THIRTY,
			},
		);

		const latestResult = await this.getParsedPlinkoResult();
		logger.info(`New Plinko result found: ${latestResult}`);

		return latestResult;
	}

	@step("Get history buttons count")
	private async getHistoryButtonsCount(): Promise<number> {
		try {
			const count =
				await this.gamdomPage.map.inGameChipsHistoryButton.count();
			logger.info(`History buttons count: ${count}`);
			return count;
		} catch (error) {
			throw new Error(`Failed to get history count: ${String(error)}`);
		}
	}

	@step("Get parsed Plinko result")
	private async getParsedPlinkoResult(): Promise<number> {
		await this.gamdomPage.assertThat().verifyInGameHistoryIsDisplayed();
		const latestResult = await this.gamdomPage.map.inGameChipsHistoryButton
			.first()
			.textContent();

		if (!latestResult) {
			throw new Error("Could not get result from history button");
		}

		const parsedHistoryResult = parseMultiplier(
			latestResult.trim(),
			getFormattedMultiplier({ isBig: true }),
		);

		logger.info(`Current Plinko history result: ${parsedHistoryResult}`);

		return parsedHistoryResult;
	}

	@step("Refresh page and setup bet")
	private async refreshPageAndSetupBet(
		betAmount: number,
		options?: {
			rowsValue?: number;
			riskValue?: number;
		},
	): Promise<void> {
		try {
			logger.info("Refreshing page to clear history...");

			await this.gamdomPage.navigateAndWaitForGameToLoad();

			await this.gamdomPage.fillInBetAmount(betAmount.toString());
			await this.gamdomPage.defineSliderValues(options);
		} catch (error) {
			throw new Error(
				`Failed to refresh page and setup bet: ${String(error)}`,
			);
		}
	}

	@step("Place bet and calculate profit")
	public async placeBetAndCalculateProfit(
		betAmount: number,
	): Promise<{ winnings: number; profit: number }> {
		await this.gamdomPage.fillInBetAmount(betAmount.toString());

		const previousHistoryCount = await this.getHistoryButtonsCount();

		await this.gamdomPage.dropBall();

		await waitUntil(
			async () => {
				const currentCount = await this.getHistoryButtonsCount();
				return currentCount > previousHistoryCount;
			},
			{
				errorMessage: `History count did not increase from ${previousHistoryCount} after dropping ball.`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.THIRTY,
			},
		);

		const result = await this.getParsedPlinkoResult();

		const winnings = betAmount * result;
		const profit = winnings - betAmount;

		return { winnings, profit };
	}
}
