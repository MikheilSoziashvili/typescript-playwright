import { BasePageStep } from "@pages/base/base-page-step";
import { BookOfPyramidsPage } from "./book-of-pyramids-page";
import { parseCurrencyToNumber } from "@core/utils/utils";
import { step } from "decorators/step";
import { expect } from "@playwright/test";
import { logger } from "@logger/logger";
import { Timeout } from "@enums/timeout";

export class BookOfPyramidsPageSteps extends BasePageStep<BookOfPyramidsPage> {
	public constructor(gamdomPage: BookOfPyramidsPage) {
		super(gamdomPage);
	}

	@step("Spin once and return whether it was a win")
	public async spinOnceAndGetResult(): Promise<{
		won: boolean;
		amount: number;
	}> {
		const spinButton = this.gamdomPage.map.spinButton;
		const totalWin = this.gamdomPage.map.totalWinValue;

		await expect(spinButton).toBeEnabled({ timeout: Timeout.MEDIUM });
		await spinButton.click();
		await expect(spinButton).toBeEnabled({ timeout: Timeout.MEDIUM });

		let isWinVisible = false;
		try {
			await this.gamdomPage.map.waitForVisibility({
				locator: totalWin,
				timeout: Timeout.SHORT,
			});
			isWinVisible = true;
		} catch {
			isWinVisible = false;
		}

		if (isWinVisible) {
			const raw = await totalWin.textContent();
			const amount = parseCurrencyToNumber(raw ?? "0");

			const won = amount > 0;
			logger.info(
				won
					? `WIN detected with amount: ${amount}`
					: "LOSS detected (win element visible but amount = 0)",
			);

			return { won: won, amount: won ? amount : 0 };
		}

		logger.info("LOSS detected (no win element)");
		return { won: false, amount: 0 };
	}

	@step("Play until won and return all results")
	public async playUntilWonAndGetResults(): Promise<
		{
			won: boolean;
			amount: number;
		}[]
	> {
		const results: { won: boolean; amount: number }[] = [];
		let hasWon = false;

		while (!hasWon) {
			const result = await this.spinOnceAndGetResult();
			results.push(result);

			if (result.won) {
				hasWon = true;
				logger.info(
					`Won after ${results.length} spin(s) with total amount: ${result.amount}`,
				);
			}
		}

		return results;
	}
}
