import { expect, Locator } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { HiloGamePage } from "./hilo-game-page";
import { HiloGameStatusMessage } from "@enums/hilo-result-messages";
import { parseToFloat } from "@core/utils/utils";

export class HiloGamePageAsserter extends BaseAsserter<HiloGamePage> {
	public constructor(page: HiloGamePage) {
		super(page);
	}

	@step("Check countdown is visible with Spinning In status")
	public async countdownIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.spinningCountdownTimer,
		]);
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.spinningCountdownTimer,
				expectedText: HiloGameStatusMessage.SPINNING_IN,
			},
		]);
	}

	@step("Check Your Bet field has expected value")
	public async yourBetFieldHasValue(value: string): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.yourBetField,
				expectedValue: value,
			},
		]);
	}

	@step("Check bet option buttons are enabled")
	public async betOptionButtonsAreEnabled(buttons: Locator[]): Promise<void> {
		await this.checkElementsAreEnabled(buttons);
	}

	@step("Check bet is placed in stats table")
	public async betIsPlaced(
		username: string,
		betAmount: number,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.statsTableBody
				.filter({ hasText: username })
				.filter({ hasText: parseToFloat(betAmount) }),
		]);
	}

	@step("Check payout is displayed in stats table")
	public async payoutIsDisplayed(
		username: string,
		payoutAmount: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.statsTableBody
				.filter({ hasText: username })
				.filter({ hasText: payoutAmount }),
		]);
	}

	@step("Check history cards are visible")
	public async historyCardsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.histroyCardsContainer,
		]);
	}

	@step("Check card color percentage values are equal")
	public async cardColorPercentageValuesEqual(
		expectedPercentage: number,
		actualPercentage: number,
	): Promise<void> {
		expect(expectedPercentage).toBe(actualPercentage);
	}
}
