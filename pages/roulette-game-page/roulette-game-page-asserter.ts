import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { RouletteGamePage } from "./roulette-game-page";
import { RouletteBetColor } from "@enums/original-games";
import { plusSignWithExactDecimalCurrency } from "@support/regex-patterns";
import { parseToFloat } from "@core/utils/utils";
import { RouletteAutobetSection } from "@enums/roulette-autobet-section";
import { Timeout } from "@enums/timeout";

export class RouletteGamePageAsserter extends BaseAsserter<RouletteGamePage> {
	public constructor(page: RouletteGamePage) {
		super(page);
	}

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

	public async betButtonsEnabled(): Promise<void> {
		for (const betButton of Object.values(
			this.gamdomPage.map.betSectionsByColor,
		)) {
			await expect(betButton).toHaveCSS("opacity", "1");
		}
	}

	public async playersBetsDisplayed(
		bets: {
			betColor: RouletteBetColor;
			username: string;
			betAmount: number;
		}[],
	): Promise<void> {
		for (const { betColor, username, betAmount } of bets) {
			const betSection = this.gamdomPage.map.betSectionsByColor[betColor];

			const betRows = await this.gamdomPage.map.playersGridRows(
				betSection,
			);

			for (const row of betRows) {
				const [rowUsernameText, rowBetAmountText] = await Promise.all([
					this.gamdomPage.map
						.playersGridRowPlayerUsername(row)
						.innerText(),
					this.gamdomPage.map
						.playersGridRowBetAmount(row)
						.innerText(),
				]);

				if (
					rowUsernameText.includes(username) &&
					rowBetAmountText.includes(String(betAmount))
				) {
					await Promise.all([
						expect(
							this.gamdomPage.map.playersGridRowPlayerUsername(
								row,
							),
						).toContainText(username),
						expect(
							this.gamdomPage.map.playersGridRowBetAmount(row),
						).toContainText(String(betAmount)),
					]);

					break;
				}
			}
		}
	}

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

	public async rouletteIsSpinning(): Promise<void> {
		await this.checkElementsAreNotVisible(
			[this.gamdomPage.map.spinningStateLocator],
			Timeout.MAX,
		);
	}

	public async totalBetsAre(
		betColor: RouletteBetColor,
		betsCount: number,
		betsAmount: number,
	): Promise<void> {
		const betSection = this.gamdomPage.map.betSectionsByColor[betColor];

		await expect(
			this.gamdomPage.map.betTotalBetsCount(betSection),
		).toHaveText(`${betsCount}`);
		await expect(
			this.gamdomPage.map.betTotalBetsAmount(betSection),
		).toContainText(parseToFloat(betsAmount));
	}

	public async profitAmountDisplayed(
		betColor: RouletteBetColor,
		betAmount: number,
	): Promise<void> {
		const betSection = this.gamdomPage.map.betSectionsByColor[betColor];

		await expect(this.gamdomPage.map.betProfit(betSection)).toContainText(
			plusSignWithExactDecimalCurrency(parseToFloat(betAmount)),
		);
		const betRow = (
			await this.gamdomPage.map.playersGridRows(betSection)
		)[0];
		await expect(
			this.gamdomPage.map.playersGridRowBetAmount(betRow),
		).toContainText(
			plusSignWithExactDecimalCurrency(parseToFloat(betAmount)),
		);
	}

	public async previousRollsHistoryUpdated(
		rouletteNumber: string,
	): Promise<void> {
		await expect(this.gamdomPage.map.latestRollResultNumber).toHaveText(
			`${rouletteNumber}`,
		);
	}

	public async greenHuntIsActive(): Promise<void> {
		await expect(
			this.gamdomPage.map.autobetSectionStatus(
				RouletteAutobetSection.GREEN_HUNT,
			),
		).toHaveText("Active");
		await expect(this.gamdomPage.map.stopGreenHuntButton()).toBeVisible();
	}
}
