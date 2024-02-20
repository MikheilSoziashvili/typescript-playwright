import { Locator, expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { RouletteGamePage } from "./roulette-game-page";
import { RouletteNumberColor } from "../../enums/original-games";
import { plusSignWithExactDecimalCurrency } from "../../regex-patterns";

export class RouletteGamePageAsserter extends BaseAsserter<RouletteGamePage> {
	public constructor(page: RouletteGamePage) {
		super(page);
	}

	public async potentialBenefitValueIs(
		value: number,
		rouletteNumberColor: RouletteNumberColor,
		beforeBetPlacement: boolean = true,
	): Promise<void> {
		switch (rouletteNumberColor) {
			case RouletteNumberColor.GREEN:
				beforeBetPlacement
					? await expect(
							this.gamdomPage.map.betPotentialProfit(
								this.gamdomPage.map.greenBetSection,
							),
						).toContainText(`${parseFloat(`${value}`).toFixed(2)}`)
					: await expect(
							this.gamdomPage.map.betProfit(
								this.gamdomPage.map.greenBetSection,
							),
						).toContainText(`${parseFloat(`${value}`).toFixed(2)}`);
				break;
			case RouletteNumberColor.RED:
				beforeBetPlacement
					? await expect(
							this.gamdomPage.map.betPotentialProfit(
								this.gamdomPage.map.redBetSection,
							),
						).toContainText(`${parseFloat(`${value}`).toFixed(2)}`)
					: await expect(
							this.gamdomPage.map.betProfit(
								this.gamdomPage.map.redBetSection,
							),
						).toContainText(`${parseFloat(`${value}`).toFixed(2)}`);
				break;
			case RouletteNumberColor.BLACK:
				beforeBetPlacement
					? await expect(
							this.gamdomPage.map.betPotentialProfit(
								this.gamdomPage.map.blackBetSection,
							),
						).toContainText(`${parseFloat(`${value}`).toFixed(2)}`)
					: await expect(
							this.gamdomPage.map.betProfit(
								this.gamdomPage.map.blackBetSection,
							),
						).toContainText(`${parseFloat(`${value}`).toFixed(2)}`);
				break;
			default:
				break;
		}
	}

	public async betButtonsEnabled(): Promise<void> {
		for (const betButton of [
			this.gamdomPage.map.betButton(this.gamdomPage.map.greenBetSection),
			this.gamdomPage.map.betButton(this.gamdomPage.map.redBetSection),
			this.gamdomPage.map.betButton(this.gamdomPage.map.blackBetSection),
		]) {
			await expect(betButton).toHaveCSS("opacity", "1");
		}
	}

	public async playerBetDisplayed(
		rouletteNumberColor: RouletteNumberColor,
		username: string,
		betAmount: number,
	): Promise<void> {
		switch (rouletteNumberColor) {
			case RouletteNumberColor.GREEN:
				break;
			case RouletteNumberColor.RED:
				for (const betRow of await this.gamdomPage.map.playersGridRows(
					this.gamdomPage.map.redBetSection,
				)) {
					await expect(
						this.gamdomPage.map.playersGridRowPlayerUsername(
							betRow,
						),
					).toHaveText(username);
					await expect(
						this.gamdomPage.map.playersGridRowBetAmount(betRow),
					).toContainText(`${parseFloat(`${betAmount}`).toFixed(2)}`);
				}
				break;
			case RouletteNumberColor.BLACK:
				break;

			default:
				break;
		}
	}

	public async totalBetsAre(
		rouletteNumberColor: RouletteNumberColor,
		betsCount: number,
		betsAmount: number,
	): Promise<void> {
		switch (rouletteNumberColor) {
			case RouletteNumberColor.GREEN:
				break;
			case RouletteNumberColor.RED:
				await expect(
					this.gamdomPage.map.betTotalBetsCount(
						this.gamdomPage.map.redBetSection,
					),
				).toHaveText(`${betsCount}`);
				await expect(
					this.gamdomPage.map.betTotalBetsAmount(
						this.gamdomPage.map.redBetSection,
					),
				).toContainText(`${parseFloat(`${betsAmount}`).toFixed(2)}`);
				break;
			case RouletteNumberColor.BLACK:
				break;

			default:
				break;
		}
	}

	public async profitAmountDisplayed(
		rouletteNumberColor: RouletteNumberColor,
		betAmount: number,
	): Promise<void> {
		switch (rouletteNumberColor) {
			case RouletteNumberColor.GREEN:
				break;
			case RouletteNumberColor.RED: {
				await expect(
					this.gamdomPage.map.betProfit(
						this.gamdomPage.map.redBetSection,
					),
				).toContainText(
					plusSignWithExactDecimalCurrency(
						parseFloat(`${betAmount}`).toFixed(2),
					),
				);
				const betRow = (
					await this.gamdomPage.map.playersGridRows(
						this.gamdomPage.map.redBetSection,
					)
				)[0];
				await expect(
					this.gamdomPage.map.playersGridRowBetAmount(betRow),
				).toContainText(
					plusSignWithExactDecimalCurrency(
						parseFloat(`${betAmount}`).toFixed(2),
					),
				);
				break;
			}
			case RouletteNumberColor.BLACK:
				break;

			default:
				break;
		}
	}

	public async previousRollsHistoryUpdated(
		rouletteNumber: string,
	): Promise<void> {
		await expect(this.gamdomPage.map.latestRollResultNumber).toHaveText(
			`${rouletteNumber}`,
		);
	}
}
