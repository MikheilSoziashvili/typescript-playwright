import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { RouletteBetColor } from "@enums/original-games";
import {
	GreenHuntTypeOption,
	RouletteAutobetSection,
} from "@enums/roulette-autobet-section";

export class RouletteGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get mainContainer(): Locator {
		return this.page.locator("#site_content");
	}

	public get gameContainerV3(): Locator {
		return this.mainContainer.locator("*[class*='ContainerAnimate']");
	}

	public get gameContainer(): Locator {
		return this.gameContainerV3.or(this.gameContainerV4);
	}

	public get gameStatusContainer(): Locator {
		return this.gameContainer.getByTestId("rouletteGameStatusContainer");
	}

	public get placeBetGrid(): Locator {
		return this.gameContainer.getByTestId("roulettePlaceBetGrid");
	}

	public get yourBetGrid(): Locator {
		return this.placeBetGrid.getByTestId("rouletteYourBetGrid");
	}

	public get betField(): Locator {
		return this.yourBetGrid.locator("input[class*='AdornedStart']");
	}

	public get autobetButton(): Locator {
		return this.placeBetGrid
			.getByTestId("rouletteAutoBetGrid")
			.locator("button");
	}

	public get spinningStateLocator(): Locator {
		return this.gameStatusContainer.getByTestId("rouletteSpinningInState");
	}

	public get spinningCountdownCounter(): Locator {
		return this.spinningStateLocator.locator(
			"+div[class*='GameStatus'] h3",
		);
	}

	public get gameResultStateLocator(): Locator {
		return this.gameStatusContainer.getByTestId("rouletteGameResult");
	}

	public get roundResultNumber(): Locator {
		return this.gameResultStateLocator.locator("h5");
	}

	public get betOptionsGrid(): Locator {
		return this.gameContainer.getByTestId("rouletteBetGrid");
	}

	public get betSectionsByColor(): Record<RouletteBetColor, Locator> {
		return {
			[RouletteBetColor.GREEN]: this.greenBetSection,
			[RouletteBetColor.RED]: this.redBetSection,
			[RouletteBetColor.BLACK]: this.blackBetSection,
		};
	}

	public get redBetSection(): Locator {
		return this.betOptionsGrid.getByTestId("rouletteBetSection-red");
	}

	public get greenBetSection(): Locator {
		return this.betOptionsGrid.getByTestId("rouletteBetSection-green");
	}

	public get blackBetSection(): Locator {
		return this.betOptionsGrid.getByTestId("rouletteBetSection-black");
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
			"div[data-testid*=rouletteNbOfBetsDetails] h6",
		);
	}

	public betTotalBetsAmount(betSection: Locator): Locator {
		return this.betDetails(betSection).locator(
			"h6[data-testid*=rouletteTotalBetAmount]",
		);
	}

	public get previousResultsList(): Locator {
		return this.gameContainer.getByTestId("roulettePreviousRollsList");
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

	public betRowsByColor(betColor: RouletteBetColor): Locator {
		return this.page
			.getByTestId(`roulettePlayersGrid-${betColor}`)
			.locator('div[class*="BetListItem-styled__BetListItemWapper"]');
	}

	public betUsername(row: Locator): Locator {
		return row.locator("div[class*='BetListItem-styled__UserNameStyled']");
	}

	public betUsernameAndAmount(row: Locator): Locator {
		return row.locator("[class*='currency-amount']");
	}

	public autobetContainer(): Locator {
		return this.gameContainer.locator("div[class*='AutoBetContainer']");
	}

	public autobetSectionContainer(
		sectionName: RouletteAutobetSection,
	): Locator {
		return this.autobetContainer()
			.locator("div[class*='MuiGrid-grid-md-4']")
			.filter({
				has: this.page.locator(
					`div[class*='BoxTitleWrapper'] h5:text-is("${sectionName}")`,
				),
			});
	}

	public autobetSectionStatus(
		sectionName:
			| RouletteAutobetSection.ROULETTE_AUTO_BET
			| RouletteAutobetSection.GREEN_HUNT,
	): Locator {
		return this.autobetSectionContainer(sectionName).locator("div[mode]");
	}

	public greenHuntAutomaticallyBetTextInput(): Locator {
		return this.autobetSectionContainer(RouletteAutobetSection.GREEN_HUNT)
			.locator("div[inputmode=numeric]")
			.filter({
				has: this.page.locator('label:text-is("Automatically Bet")'),
			})
			.locator("input");
	}

	public greenHuntTypeDropdown(): Locator {
		return this.autobetSectionContainer(
			RouletteAutobetSection.GREEN_HUNT,
		).locator("div[class*='DropdownContainer']");
	}

	public greenHuntTypeTextInput(): Locator {
		return this.greenHuntTypeDropdown()
			.filter({
				has: this.page.locator('label:text-is("When")'),
			})
			.locator("input");
	}

	public greenHuntTypeList(): Locator {
		return this.page.locator("ul[role=listbox]");
	}

	public greenHuntTypeOption(option: GreenHuntTypeOption): Locator {
		return this.getDropdownOptionSelector(option, this.greenHuntTypeList());
	}

	public startGreenHuntButton(): Locator {
		return this.autobetSectionContainer(RouletteAutobetSection.GREEN_HUNT)
			.locator("button")
			.filter({
				hasText: "Start Green Hunt",
			});
	}

	public stopGreenHuntButton(): Locator {
		return this.autobetSectionContainer(RouletteAutobetSection.GREEN_HUNT)
			.locator("button")
			.filter({
				hasText: "Stop",
			});
	}

	public get stopIfBalanceIsOver(): Locator {
		return this.page.getByLabel("Stop if balance is over");
	}

	public get startAutobetButton(): Locator {
		return this.page.getByRole("button").filter({
			hasText: "Start Autobet",
		});
	}

	public get stopAutobetButton(): Locator {
		return this.page.getByRole("button").filter({
			hasText: "Stop",
		});
	}

	public get gameContainerV4(): Locator {
		return this.page.locator("*[class*='MainBodyContentContainer']");
	}

	public get gameResultStateLocatorV4(): Locator {
		return this.page.getByTestId("game-wrapper-state-AfterGame");
	}

	public get spinningCountdownCounterV4(): Locator {
		return this.page.getByTestId("game-wrapper-state-Rolling").first();
	}

	public get betFieldV4(): Locator {
		return this.page.getByTestId("roulette-stake-input-field-container");
	}

	public get betOptionsGridV4(): Locator {
		return this.gameContainerV4.getByTestId("bets-wrapper");
	}

	public get betSectionsByColorV4(): Record<RouletteBetColor, Locator> {
		return {
			[RouletteBetColor.GREEN]: this.greenBetSectionV4,
			[RouletteBetColor.RED]: this.redBetSectionV4,
			[RouletteBetColor.BLACK]: this.blackBetSectionV4,
		};
	}

	public get redBetSectionV4(): Locator {
		return this.betOptionsGridV4.getByTestId("bet-red-button");
	}

	public get greenBetSectionV4(): Locator {
		return this.betOptionsGridV4.getByTestId("bet-green-button");
	}

	public get blackBetSectionV4(): Locator {
		return this.betOptionsGridV4.getByTestId("bet-black-button");
	}
}
