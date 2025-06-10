import { parseBalance, waitUntil } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import {
	PlinkoRiskOption,
	PlinkoRowsOption,
} from "@enums/plinko/plinko-game-options";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect, Locator } from "@playwright/test";
import { step } from "decorators/step";
import { PlinkoGamePage } from "./plinko-game-page";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { Timeout } from "@enums/timeout";

export class PlinkoGamePageSteps extends BasePageStep<PlinkoGamePage> {
	public constructor(gamdomPage: PlinkoGamePage) {
		super(gamdomPage);
	}

	@step()
	public async navigateToAutobetSuccessfully(): Promise<void> {
		await this.gamdomPage.clickAutobet();
		await expect(this.gamdomPage.map.autoBetButton).toHaveAttribute(
			Attributes.DATA_STATE,
			AttributesValues.ACTIVE,
		);
	}

	@step()
	public async enterNumberOfBets(betsNumber: string): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.betCountsContainer]);
		await this.gamdomPage.map.numberOfBetsInput.fill(betsNumber);
	}

	@step()
	public async startAutobetSuccessfully(): Promise<void> {
		await this.gamdomPage.assertThat().starAutobetButtonIsDisplayed();
		await this.gamdomPage.map.startAutobetButton.click();
		await this.gamdomPage.assertThat().stopAutobetButtonIsDisplayed();
	}

	@step()
	public async stopAutobetSuccessfully(): Promise<void> {
		await this.gamdomPage.assertThat().stopAutobetButtonIsDisplayed();
		await this.gamdomPage.map.stopAutobetButton.click();
		await this.gamdomPage.assertThat().starAutobetButtonIsDisplayed();
	}

	@step()
	private async fetchRemainingBetsValue(): Promise<number> {
		const text =
			await this.gamdomPage.map.remainingBetsBalanceLabel.textContent();
		return text ? parseInt(text.trim(), 10) : NaN;
	}

	@step()
	private async validateCounterIsDecreasing(
		current: number,
		previous: number,
	): Promise<void> {
		expect(
			current,
			`Counter did not decrease! Previous: ${previous}, Current: ${current}`,
		).toBeLessThan(previous);
	}

	@step()
	private async ensureStopAutobetButtonIsVisible(): Promise<void> {
		await expect(this.gamdomPage.map.stopAutobetButton).toBeVisible();
	}

	@step()
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

	@step()
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

	@step()
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

	@step()
	public async waitForSlidersToBeActive(): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.verifyRowsSliderActive(Timeout.EXTRA_LONG);
		await this.gamdomPage
			.assertThat()
			.verifyRiskSliderActive(Timeout.EXTRA_LONG);
	}
}
