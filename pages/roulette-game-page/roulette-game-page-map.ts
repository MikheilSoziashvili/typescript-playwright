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

	public get roulette(): Locator {
		return this.gameContainer.locator("> div:nth-child(1)");
	}

	public get gameStatusContainer(): Locator {
		return this.roulette.locator("*[class*='GameStatusWrapper']");
	}

	public get betOptions(): Locator {
		return this.gameContainer.locator("> div:nth-child(2)");
	}

	public get betField(): Locator {
		return this.betOptions.locator(
			"*[class*='PlaceBet'] input[class*='AdornedStart']"
		);
	}

	public get placeBetBtn(): Locator {
		return this.betOptions.locator(
			"> div:nth-child(2) > div:nth-child(2) > div > div:nth-child(6) button"
		);
	}

	public get spinningCountdownCounter(): Locator {
		return this.gameStatusContainer.locator("h3");
	}

	public get roundResultNumber(): Locator {
		return this.gameStatusContainer
			.filter({
				has: this.page.locator("*[class*='RoundResultNumber']"),
			})
			.locator("h5");
	}

	public get betSections(): Locator {
		return this.betOptions.locator("*[class*='BetButtonWrapper']");
	}

	public get betSectionsByColor(): Record<RouletteNumberColor, Locator> {
		return {
			[RouletteNumberColor.GREEN]: this.greenBetSection,
			[RouletteNumberColor.RED]: this.redBetSection,
			[RouletteNumberColor.BLACK]: this.blackBetSection,
		};
	}

	public get redBetSection(): Locator {
		return this.betSections.nth(0);
	}

	public get greenBetSection(): Locator {
		return this.betSections.nth(1);
	}

	public get blackBetSection(): Locator {
		return this.betSections.nth(2);
	}

	public betPotentialProfit(betSection: Locator): Locator {
		return betSection.locator("*[class*='PotentialProfit']");
	}

	public betProfit(betSection: Locator): Locator {
		return betSection.locator("> div:nth-child(1)");
	}

	public betButton(betSection: Locator): Locator {
		return betSection.locator("button");
	}

	public betTotalBetsCount(betSection: Locator): Locator {
		return betSection
			.locator("> div:nth-child(2) > div:nth-child(2) > div")
			.nth(0);
	}

	public betTotalBetsAmount(betSection: Locator): Locator {
		return betSection
			.locator("> div:nth-child(2) > div:nth-child(2) > div")
			.nth(1);
	}

	public playersGridContainer(betSection: Locator): Locator {
		return betSection.locator("*[class*='BetsList']");
	}

	public playersGrid(betSection: Locator): Locator {
		return this.playersGridContainer(betSection).locator("> div");
	}

	public playersGridRows(betSection: Locator): Promise<Locator[]> {
		return this.playersGrid(betSection)
			.locator("> *[class*='BetListItem']")
			.all();
	}

	public playersGridRowPlayerUsername(playerGridRow: Locator): Locator {
		return playerGridRow.locator("*[class*='UserName']");
	}

	public playersGridRowBetAmount(playerGridRow: Locator): Locator {
		return playerGridRow.locator("*[class*='currency-amount']");
	}

	public get latestRollResultNumber(): Locator {
		return this.roulette.locator("*[class*=PreviousRollItem]").first();
	}
}
