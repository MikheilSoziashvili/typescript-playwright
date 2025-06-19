import { BasePageStep } from "@pages/base/base-page-step";
import { StatisticsPage } from "./statistics-page";
import { expect } from "@playwright/test";
import { parseCurrencyToNumber } from "@core/utils/utils";

export class StatisticsPageSteps extends BasePageStep<StatisticsPage> {
	public constructor(gamdomPage: StatisticsPage) {
		super(gamdomPage);
	}

	public async getLast24HoursGameLargestProfit(
		gameName: string,
	): Promise<number> {
		const profitElement =
			this.gamdomPage.map.last24HoursGameLargestProfitByPlaceholder(
				gameName,
			);

		await expect(profitElement).toBeVisible();

		const profitText = await profitElement.textContent();

		return parseCurrencyToNumber(profitText as string);
	}
}
