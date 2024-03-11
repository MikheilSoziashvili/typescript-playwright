import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";
import { RouletteNumberColor } from "../../enums/original-games";

export class RouletteGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get mainContainer(): Locator {
		return this.page.locator("#site_content");
	}

	public get gameContainer(): Locator {
		return this.mainContainer.locator("*[class*='ContainerAnimate']");
	}

	public get gameStatusContainer(): Locator {
		return this.gameContainer.locator(
			"div[data-testid=rouletteGameStatusContainer]",
		);
	}

	public get placeBetGrid(): Locator {
		return this.gameContainer.locator(
			"div[data-testid=roulettePlaceBetGrid]",
		);
	}

	public get yourBetGrid(): Locator {
		return this.placeBetGrid.locator(
			"div[data-testid=rouletteYourBetGrid]",
		);
	}

	public get betField(): Locator {
		return this.yourBetGrid.locator("input[class*='AdornedStart']");
	}

	public get spinningStateLocator(): Locator {
		return this.gameStatusContainer.locator(
			"div[data-testid=rouletteSpinningInState]",
		);
	}

	public get spinningCountdownCounter(): Locator {
		return this.spinningStateLocator.locator(
			"+div[class*='GameStatus'] h3",
		);
	}

	public get gameResultStateLocator(): Locator {
		return this.gameStatusContainer.locator(
			"div[data-testid=rouletteGameResult]",
		);
	}

	public get roundResultNumber(): Locator {
		return this.gameResultStateLocator.locator("h5");
	}

	public get betOptionsGrid(): Locator {
		return this.gameContainer.locator("div[data-testid=rouletteBetGrid]");
	}

	public get betSectionsByColor(): Record<RouletteNumberColor, Locator> {
		return {
			[RouletteNumberColor.GREEN]: this.greenBetSection,
			[RouletteNumberColor.RED]: this.redBetSection,
			[RouletteNumberColor.BLACK]: this.blackBetSection,
		};
	}

	public get redBetSection(): Locator {
		return this.betOptionsGrid.locator(
			"div[data-testid=rouletteBetSection-red]",
		);
	}

	public get greenBetSection(): Locator {
		return this.betOptionsGrid.locator(
			"div[data-testid=rouletteBetSection-green]",
		);
	}

	public get blackBetSection(): Locator {
		return this.betOptionsGrid.locator(
			"div[data-testid=rouletteBetSection-black]",
		);
	}

	public betPotentialProfit(betSection: Locator): Locator {
		return betSection.locator(
			"div[data-testid*=rouletteBetPotentialProfit]",
		);
	}

	public betProfit(betSection: Locator): Locator {
		return betSection.locator("div[data-testid*=rouletteBetProfit]");
	}

	public betButton(betSection: Locator): Locator {
		return betSection.locator("button[data-testid*=rouletteBetBtn]");
	}

	public betDetails(betSection: Locator): Locator {
		return betSection.locator("div[data-testid*=rouletteBetDetails]");
	}

	public betTotalBetsCount(betSection: Locator): Locator {
		return this.betDetails(betSection).locator(
			"div[data-testid*=rouletteNbOfBetsDetails]",
		);
	}

	public betTotalBetsAmount(betSection: Locator): Locator {
		return this.betDetails(betSection).locator(
			"h6[data-testid*=rouletteTotalBetAmount]",
		);
	}

	public get previousResultsList(): Locator {
		return this.gameContainer.locator(
			"div[data-testid=roulettePreviousRollsList]",
		);
	}

	public get latestRollResultNumber(): Locator {
		return this.previousResultsList
			.locator("div[data-testid*=roulettePreviousRollsItem]")
			.first();
	}

	public playersGridContainer(betSection: Locator): Locator {
		return betSection.locator("div[data-testid*=roulettePlayersGrid]");
	}

	public async playersGridRows(betSection: Locator): Promise<Locator[]> {
		return this.playersGridContainer(betSection)
			.locator("div[data-testid*=roulettePlayersGridRow]")
			.all();
	}

	public playersGridRowPlayerUsername(playerGridRow: Locator): Locator {
		return playerGridRow.locator(
			"div[data-testid*=roulettePlayersGridUsername]",
		);
	}

	public playersGridRowBetAmount(playerGridRow: Locator): Locator {
		return playerGridRow.locator(
			"p[data-testid*=roulettePlayersGridBetAmount]",
		);
	}
}
