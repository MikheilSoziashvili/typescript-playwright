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

	@step("Start manual bet")
	public async startManualBet(
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
}
