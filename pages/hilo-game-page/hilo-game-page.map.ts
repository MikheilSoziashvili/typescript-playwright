import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

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

	public get gameArea(): Locator {
		return this.gameContainer.getByTestId("hiloGameAreaColumn");
	}

	public get betControlsArea(): Locator {
		return this.gameContainer.getByTestId("hiloBetControlsAreaColumn");
	}

	public get statsArea(): Locator {
		return this.gameContainer.getByTestId("hiloStatsAreaColumn");
	}

	// game area
	public get gameStateLocator(): Locator {
		return this.gameArea.getByTestId("hiloGamestate");
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
		return this.gameArea.getByTestId("hiloBetAmountSection");
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
}
