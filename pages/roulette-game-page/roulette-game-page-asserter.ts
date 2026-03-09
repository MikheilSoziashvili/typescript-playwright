import { expect, Locator } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { RouletteGamePage } from "./roulette-game-page";
import { RouletteBetColor } from "@enums/original-games";
import { RouletteAutobetSection } from "@enums/roulette-autobet-section";
import { parseToFloat } from "@core/utils/utils";
import { logger } from "@logger/logger";

export class RouletteGamePageAsserter extends BaseAsserter<RouletteGamePage> {
	public constructor(page: RouletteGamePage) {
		super(page);
	}

	@step("Check bet buttons are enabled")
	public async betButtonsEnabled(): Promise<void> {
		for (const betButton of Object.values(
			this.gamdomPage.map.betSectionsByColor,
		)) {
			await expect(betButton).toHaveCSS("opacity", "1");
		}
	}

	@step("Check players bets are displayed")
	public async playersBetsDisplayed(
		bets: {
			betColor: RouletteBetColor;
			username: string;
			betAmount: number;
		}[],
	): Promise<void> {
		for (const { betColor, username, betAmount } of bets) {
			const betRows = await this.gamdomPage.map
				.betRowsByColor(betColor)
				.all();

			for (const row of betRows) {
				if (
					await this.assertRowUsernameAndBetAmount(
						row,
						username,
						betAmount,
						`BEFORE SPIN`,
					)
				) {
					break;
				}
			}
		}
	}

	@step("Check potential profit is displayed")
	public async potentialProfitIs(
		betColor: RouletteBetColor,
		profitAmount: number,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.betPotentialProfit(betColor),
		).toContainText(parseToFloat(profitAmount));
	}

	@step("Check green hunt is active")
	public async greenHuntIsActive(): Promise<void> {
		await expect(
			this.gamdomPage.map.autobetSectionStatus(
				RouletteAutobetSection.GREEN_HUNT,
			),
		).toHaveText("Active");
		await expect(this.gamdomPage.map.stopGreenHuntButton()).toBeVisible();
	}

	@step("Assert row username and bet amount")
	private async assertRowUsernameAndBetAmount(
		row: Locator,
		username: string,
		betAmount: number,
		context: `BEFORE SPIN` | `AFTER SPIN`,
	): Promise<boolean> {
		const [rowUsernameText, rowBetAmountText] = await Promise.all([
			this.gamdomPage.map.betUsername(row).innerText(),
			this.gamdomPage.map.betAmount(row).innerText(),
		]);

		logger.info(
			`${context}: row username: ${rowUsernameText} with bet amount: ${betAmount}`,
		);

		if (
			rowUsernameText.includes(username) &&
			rowBetAmountText.includes(String(betAmount))
		) {
			await Promise.all([
				expect(this.gamdomPage.map.betUsername(row)).toContainText(
					username,
				),
				expect(this.gamdomPage.map.betAmount(row)).toContainText(
					String(betAmount),
				),
			]);
			return true;
		}
		return false;
	}
}
