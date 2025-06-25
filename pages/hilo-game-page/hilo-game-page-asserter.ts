import { expect } from "@playwright/test";
import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { HiloGamePage } from "./hilo-game-page";
import { Timeout } from "@enums/timeout";

export class HiloGamePageAsserter extends BaseAsserter<HiloGamePage> {
	public constructor(page: HiloGamePage) {
		super(page);
	}

	@step("Check game message")
	public async gameMessageIs(
		resultMessage: HiloGameStatusMessage,
	): Promise<void> {
		await expect(this.gamdomPage.map.gameStatusLocator).not.toBeEmpty({
			timeout: Timeout.LONG,
		});

		await expect(this.gamdomPage.map.gameStatusLocator).toHaveText(
			resultMessage,
			{ timeout: Timeout.LONG },
		);
	}

	@step("Check game result color")
	public async gameResultColorIs(
		resultMessage: HiloGameResultColor,
	): Promise<void> {
		await expect(this.gamdomPage.map.gamRoundResultLocator).not.toBeEmpty();

		await expect(this.gamdomPage.map.gamRoundResultLocator).toContainText(
			resultMessage,
		);
	}

	@step("Check card color percentage values are equal")
	public async cardColorPercentageValuesEqual(
		expectedPercentage: number,
		actualPercentage: number,
	): Promise<void> {
		expect(expectedPercentage).toBe(actualPercentage);
	}
}
