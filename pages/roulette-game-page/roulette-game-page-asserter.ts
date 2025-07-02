import { expect, Locator } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { RouletteGamePage } from "./roulette-game-page";
import { RouletteBetColor } from "@enums/original-games";
import { plusSignWithExactDecimalCurrency } from "@support/regex-patterns";
import { parseToFloat } from "@core/utils/utils";
import { RouletteAutobetSection } from "@enums/roulette-autobet-section";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";

export class RouletteGamePageAsserter extends BaseAsserter<RouletteGamePage> {
	public constructor(page: RouletteGamePage) {
		super(page);
	}

	@step("Check potential benefit value")
	public async potentialBenefitValueIs(
		value: number,
		betColor: RouletteBetColor,
		beforeBetPlacement = true,
	): Promise<void> {
		const betSection = this.gamdomPage.map.betSectionsByColor[betColor];
		beforeBetPlacement
			? await expect(
					this.gamdomPage.map.betPotentialProfit(betSection),
			  ).toContainText(parseToFloat(value))
			: await expect(
					this.gamdomPage.map.betProfit(betSection),
			  ).toContainText(parseToFloat(value), {
					timeout: Timeout.EXTRA_LONG,
			  });
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
				await Promise.all([
					this.gamdomPage.map.betUsername(row).innerText(),
					this.gamdomPage.map.betUsernameAndAmount(row).innerText(),
				]);

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

	@step("Check total bets matches number of bet rows")
	public async totalBetsMatchesNumberOfBetRows(
		betColor: RouletteBetColor,
	): Promise<void> {
		await this.rouletteIsSpinning();

		const [rowCount, totalBetsCount] = await Promise.all([
			this.gamdomPage.getNumberOfBetRows(betColor),
			this.gamdomPage.getTotalBetsCount(betColor),
		]);
		expect(rowCount).toEqual(totalBetsCount);
	}

	@step("Check roulette is spinning")
	public async rouletteIsSpinning(): Promise<void> {
		await this.checkElementsAreNotVisible(
			[this.gamdomPage.map.spinningStateLocator],
			Timeout.MAX,
		);
	}

	@step("Check total bets")
	public async totalBetsAre(
		betColor: RouletteBetColor,
	): Promise<void> {
		const betSection = this.gamdomPage.map.betSectionsByColor[betColor];

		const betRows = await this.gamdomPage.map
				.betRowsByColor(betColor).count();

		const numberOfBets = await this.gamdomPage.map
			.betTotalBetsCount(betSection)
			.textContent();
		const numberOfBetsAsNumber = parseInt(numberOfBets ?? "0");

		expect(numberOfBetsAsNumber, `Total bets count for ${betColor}`).toBe(betRows);
	}

	@step("Check profit amount is displayed")
	public async profitAmountDisplayed(
		bets: {
			betColor: RouletteBetColor;
			username: string;
			betAmount: number;
		}[],
	): Promise<void> {
		for (const { betColor, username, betAmount } of bets) {
			const betSection = this.gamdomPage.map.betSectionsByColor[betColor];

			const betRows = await this.gamdomPage.map
				.betRowsByColor(betColor)
				.all();

			for (const row of betRows) {
				await Promise.all([
					this.gamdomPage.map.betUsername(row).innerText(),
					this.gamdomPage.map.betUsernameAndAmount(row).innerText(),
				]);

				if (
					await this.assertRowUsernameAndBetAmount(
						row,
						username,
						betAmount,
						`AFTER SPIN`,
					)
				) {
					await expect(
						this.gamdomPage.map.betProfit(betSection),
					).toContainText(
						plusSignWithExactDecimalCurrency(
							parseToFloat(betAmount),
						),
					);
					break;
				}
			}
		}
	}

	@step("Check previous rolls history is updated")
	public async previousRollsHistoryUpdated(
		rouletteNumber: string,
	): Promise<void> {
		await expect(this.gamdomPage.map.latestRollResultNumber).toHaveText(
			`${rouletteNumber}`,
		);
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
			this.gamdomPage.map.betUsernameAndAmount(row).innerText(),
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
				expect(
					this.gamdomPage.map.betUsernameAndAmount(row),
				).toContainText(String(betAmount)),
			]);
			return true;
		}
		return false;
	}
}
