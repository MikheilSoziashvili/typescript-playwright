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

	public get gameContainer(): Locator {
		return this.page.locator("*[class*='MainBodyContentContainer']");
	}

	public get acceptingBetsState(): Locator {
		return this.page
			.getByTestId("game-wrapper-state-AcceptingBets")
			.first();
	}

	public get rollingState(): Locator {
		return this.page.getByTestId("game-wrapper-state-Rolling").first();
	}

	public get gameResultStateLocator(): Locator {
		return this.page.getByTestId("game-wrapper-state-AfterGame").first();
	}

	public get spinningCountdownCounter(): Locator {
		return this.page.getByTestId("game-state-AcceptingBets");
	}

	public get roundResultNumber(): Locator {
		return this.page.getByTestId("game-state-AfterGame");
	}

	public get betField(): Locator {
		return this.page.getByTestId("roulette-stake-input-field-input");
	}

	public get betSectionsByColor(): Record<RouletteBetColor, Locator> {
		return {
			[RouletteBetColor.GREEN]: this.greenBetSection,
			[RouletteBetColor.RED]: this.redBetSection,
			[RouletteBetColor.BLACK]: this.blackBetSection,
		};
	}

	public get redBetSection(): Locator {
		return this.page.getByTestId("bet-red-button");
	}

	public get greenBetSection(): Locator {
		return this.page.getByTestId("bet-green-button");
	}

	public get blackBetSection(): Locator {
		return this.page.getByTestId("bet-black-button");
	}

	public betPotentialProfit(betColor: RouletteBetColor): Locator {
		return this.page.getByTestId(`bet-below-element-${betColor}`);
	}

	public betRowsByColor(betColor: RouletteBetColor): Locator {
		return this.page
			.getByTestId(`roulette-players-wrapper-${betColor}`)
			.getByTestId("roulette-bet-list-item-wrapper");
	}

	public betUsername(row: Locator): Locator {
		return row
			.getByTestId("roulette-bet-list-item-wrapper-user-name")
			.locator("p");
	}

	public betAmount(row: Locator): Locator {
		return row.getByTestId("bet-amount");
	}

	public autobetContainer(): Locator {
		return this.page.getByTestId("autobet-toggle");
	}

	public autobetSectionStatus(
		sectionName:
			| RouletteAutobetSection.ROULETTE_AUTO_BET
			| RouletteAutobetSection.GREEN_HUNT,
	): Locator {
		const testIds: Record<string, string> = {
			[RouletteAutobetSection.GREEN_HUNT]:
				"roulette-auto-green-hunt-bet-active-tag-custom",
			[RouletteAutobetSection.ROULETTE_AUTO_BET]:
				"roulette-auto-roulette-auto-bet-active-tag-custom",
		};
		return this.page.getByTestId(testIds[sectionName]);
	}

	public greenHuntAutomaticallyBetTextInput(): Locator {
		return this.page.getByTestId(
			"autobet-green-percent-bet-input-field-input",
		);
	}

	public greenHuntTypeDropdown(): Locator {
		return this.page.getByTestId(
			"autobet-greenHunt-bet-style-dropdown-button",
		);
	}

	public greenHuntTypeOption(option: GreenHuntTypeOption): Locator {
		return this.page.getByTestId(
			`autobet-greenHunt-bet-style-dropdown-option-${option}`,
		);
	}

	public startGreenHuntButton(): Locator {
		return this.page
			.getByTestId("autobet-start-green-hunt-button")
			.filter({ hasText: "Start" });
	}

	public stopGreenHuntButton(): Locator {
		return this.page
			.getByTestId("autobet-start-green-hunt-button")
			.filter({ hasText: "Stop" });
	}

	public get stopIfBalanceIsOver(): Locator {
		return this.page.getByTestId(
			"autobet-stop-balance-max-input-field-input",
		);
	}

	public get startAutobetButton(): Locator {
		return this.page
			.getByTestId("autobet-start-autobet-button")
			.filter({ hasText: "Start" });
	}

	public get stopAutobetButton(): Locator {
		return this.page
			.getByTestId("autobet-start-autobet-button")
			.filter({ hasText: "Stop" });
	}
}
