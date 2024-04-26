import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { RouletteGamePage } from "./roulette-game-page";
import { RouletteNumberColor } from "../../enums/original-games";
import { plusSignWithExactDecimalCurrency } from "../../support/regex-patterns";
import { parseToFloat } from "../../core/utils";

export class RouletteGamePageAsserter extends BaseAsserter<RouletteGamePage> {
	public constructor(page: RouletteGamePage) {
		super(page);
	}

	public async potentialBenefitValueIs(
		value: number,
		rouletteNumberColor: RouletteNumberColor,
		beforeBetPlacement = true,
	): Promise<void> {
		const betSection =
			this.gamdomPage.map.betSectionsByColor[rouletteNumberColor];
		beforeBetPlacement
			? await expect
					.soft(this.gamdomPage.map.betPotentialProfit(betSection))
					.toContainText(parseToFloat(value))
			: await expect
					.soft(this.gamdomPage.map.betProfit(betSection))
					.toContainText(parseToFloat(value));
	}

	public async betButtonsEnabled(): Promise<void> {
		for (const betButton of Object.values(
			this.gamdomPage.map.betSectionsByColor,
		)) {
			await expect.soft(betButton).toHaveCSS("opacity", "1");
		}
	}

	public async playerBetDisplayed(
		rouletteNumberColor: RouletteNumberColor,
		username: string,
		betAmount: number,
	): Promise<void> {
		const betSection =
			this.gamdomPage.map.betSectionsByColor[rouletteNumberColor];

		for (const betRow of await this.gamdomPage.map.playersGridRows(
			betSection,
		)) {
			await expect
				.soft(this.gamdomPage.map.playersGridRowPlayerUsername(betRow))
				.toHaveText(username);
			await expect
				.soft(this.gamdomPage.map.playersGridRowBetAmount(betRow))
				.toContainText(parseToFloat(betAmount));
		}
	}

	public async totalBetsAre(
		rouletteNumberColor: RouletteNumberColor,
		betsCount: number,
		betsAmount: number,
	): Promise<void> {
		const betSection =
			this.gamdomPage.map.betSectionsByColor[rouletteNumberColor];

		await expect
			.soft(this.gamdomPage.map.betTotalBetsCount(betSection))
			.toHaveText(`${betsCount}`);
		await expect
			.soft(this.gamdomPage.map.betTotalBetsAmount(betSection))
			.toContainText(parseToFloat(betsAmount));
	}

	public async profitAmountDisplayed(
		rouletteNumberColor: RouletteNumberColor,
		betAmount: number,
	): Promise<void> {
		const betSection =
			this.gamdomPage.map.betSectionsByColor[rouletteNumberColor];

		await expect
			.soft(this.gamdomPage.map.betProfit(betSection))
			.toContainText(
				plusSignWithExactDecimalCurrency(parseToFloat(betAmount)),
			);
		const betRow = (
			await this.gamdomPage.map.playersGridRows(betSection)
		)[0];
		await expect
			.soft(this.gamdomPage.map.playersGridRowBetAmount(betRow))
			.toContainText(
				plusSignWithExactDecimalCurrency(parseToFloat(betAmount)),
			);
	}

	public async previousRollsHistoryUpdated(
		rouletteNumber: string,
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.latestRollResultNumber)
			.toHaveText(`${rouletteNumber}`);
	}
}
