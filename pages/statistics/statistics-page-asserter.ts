import { BaseAsserter } from "@base/base-asserter";
import { StatisticsPage } from "./statistics-page";
import { expect } from "@playwright/test";
import { calculateRoundedExpectedProfit } from "@formulas/betting-calculations";

export class StatisticsPageAsserter extends BaseAsserter<StatisticsPage> {
	public constructor(page: StatisticsPage) {
		super(page);
	}

	public async last24HoursGameLargestProfitIs(
		gameName: string,
		betMultiplier: number,
		betAmount: number,
	): Promise<void> {
		const actualValue = await this.gamdomPage
			.steps()
			.getLast24HoursGameLargestProfit(gameName);
		const roundedExpectedValue = calculateRoundedExpectedProfit(
			betMultiplier,
			betAmount,
		);
		expect(actualValue).toBe(roundedExpectedValue);
	}
}
