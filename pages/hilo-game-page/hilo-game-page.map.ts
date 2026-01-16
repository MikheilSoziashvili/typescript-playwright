import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { HiloGameResultColor } from "@enums/hilo-result-messages";

export class HiloGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private get siteContent(): Locator {
		return this.page.locator("#site_content");
	}

	private get gameContainer(): Locator {
		return this.siteContent.locator("div[class^='gui-styled__Container-']");
	}

	public get usersInfoArea(): Locator {
		return this.gameContainer.getByTestId("hiloUsersInfoAreaColumn");
	}

	public get gameAreaV3(): Locator {
		return this.gameContainer.getByTestId("hiloGameAreaColumn");
	}

	private get gameAreaV4(): Locator {
		return this.page.getByTestId("hilo-game-area-progress-bar-container");
	}

	public get gameArea(): Locator {
		return this.gameAreaV3.or(this.gameAreaV4);
	}

	public get betControlsArea(): Locator {
		return this.gameContainer.getByTestId("hiloBetControlsAreaColumn");
	}

	public get statsArea(): Locator {
		return this.gameContainer.getByTestId("hiloStatsAreaColumn");
	}

	public get statisticsExtraInfoContainer(): Locator {
		return this.statsArea.locator("div[class*='ExtraInfoContainer']");
	}

	public get cardsProbabilityContainer(): Locator {
		return this.statisticsExtraInfoContainer.locator(
			"div[class*='ProbabilitiesWrapper']",
		);
	}

	// game area
	public get gameStateLocator(): Locator {
		return this.gameAreaV3.getByTestId("hiloGamestate");
	}

	public get spinningCountdownTimer(): Locator {
		return this.gameStateLocator
			.locator("div", { hasText: "Spinning in" })
			.nth(1);
	}

	public get gameStatusLocator(): Locator {
		return this.gameStateLocator.locator("div[class*='Status-']");
	}

	public get gamRoundResultLocator(): Locator {
		return this.gameStateLocator.locator(
			"div[class*='GameStateUi-styled__RoundResultNumber']",
		);
	}

	public get yourBetContainer(): Locator {
		return this.gameAreaV3.getByTestId("hiloBetAmountSection");
	}

	public get yourBetField(): Locator {
		return this.yourBetContainer.locator("input");
	}

	//bet controls
	private get betButtonsContainer(): Locator {
		return this.betControlsArea.getByTestId("hiloBetButtonsArea");
	}

	private get otherButtonsContainer(): Locator {
		return this.betButtonsContainer.locator(
			"div[class*='gui-styled__OtherButtonsWrapper-']",
		);
	}

	private get colorButtonsContainer(): Locator {
		return this.otherButtonsContainer.getByTestId("hiloColorBetButtons");
	}

	public get redButton(): Locator {
		return this.colorButtonsContainer.getByText("Red");
	}

	public get blackButton(): Locator {
		return this.colorButtonsContainer.getByText("Black");
	}

	public get recentHistoryContainer(): Locator {
		return this.betControlsArea.getByTestId("hiloRecentHistory");
	}

	public get hiloHistoryButton(): Locator {
		return this.recentHistoryContainer.locator(
			"div[class*='IconContainer-sc']",
		);
	}

	public get hiloHistoryModal(): Locator {
		return this.page.locator(
			"//div[contains(@class,'sc-') and text()='Hilo History']//ancestor::div[contains(@class,'ModalPaper-sc-') and contains(@class,'open')]",
		);
	}

	public get historyCardsBlock(): Locator {
		return this.hiloHistoryModal.locator("div[color]");
	}

	public historyCardByCardColor(cardColor: HiloGameResultColor): Locator {
		return this.hiloHistoryModal.locator(`div[color='${cardColor}']`);
	}

	public get showMoreHistoryCardsButton(): Locator {
		return this.hiloHistoryModal.locator(`button`, {
			has: this.page.locator("span", { hasText: "Show more" }),
		});
	}

	public get closeHistoryModalButton(): Locator {
		return this.hiloHistoryModal.locator(`button`, {
			has: this.page.locator("i[class*='icon-remove']"),
		});
	}

	public get lastRoundsDropdown(): Locator {
		return this.statisticsExtraInfoContainer.locator(
			`[role="combobox"][aria-haspopup="listbox"]`,
		);
	}

	public get lastRoundsDropdownValuesContainer(): Locator {
		return this.page.locator(`ul[role='listbox'][class*='-list']`);
	}

	public get lastRoundsDropdownItems(): Locator {
		return this.lastRoundsDropdownValuesContainer
			.locator("li")
			.getByRole("option");
	}

	public lastRoundsDropdownItemByPlaceholder(placeholder: string): Locator {
		return this.getDropdownOptionSelector(
			placeholder,
			this.lastRoundsDropdownValuesContainer,
		);
	}

	public get lastRoundsRedCardsHistoryPercentageValue(): Locator {
		return this.cardsProbabilityContainer
			.locator(`[class*='ProbabilityContainer']`)
			.first();
	}

	public get lastRoundsBlackCardsHistoryPercentageValue(): Locator {
		return this.cardsProbabilityContainer
			.locator(`[class*='ProbabilityContainer']`)
			.last();
	}

	public get spinningCountdownTimerV4(): Locator {
		return this.page.getByTestId(
			"hilo-game-area-accepting-bets-spinning-in",
		);
	}

	public get yourBetFieldV4(): Locator {
		return this.page.getByTestId("hilo-bet-area-amount-input");
	}

	public get redButtonV4(): Locator {
		return this.page.getByTestId("hilo-bet-area-bet-red");
	}

	public get blackButtonV4(): Locator {
		return this.page.getByTestId("hilo-bet-area-bet-black");
	}
}
