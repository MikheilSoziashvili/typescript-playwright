import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { HiloGamePage } from "./hilo-game-page";
import { parseToFloat } from "@core/utils/utils";

export class HiloGamePageAsserter extends BaseAsserter<HiloGamePage> {
	public constructor(page: HiloGamePage) {
		super(page);
	}

	@step("Check bet is placed in stats table")
	public async betIsPlaced(
		username: string,
		betAmount: number,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.statsTableBody
				.filter({ hasText: username })
				.filter({ hasText: parseToFloat(betAmount) }),
		).toBeVisible();
	}

	@step("Check card color percentage values are equal")
	public async cardColorPercentageValuesEqual(
		expectedPercentage: number,
		actualPercentage: number,
	): Promise<void> {
		expect(expectedPercentage).toBe(actualPercentage);
	}
}
