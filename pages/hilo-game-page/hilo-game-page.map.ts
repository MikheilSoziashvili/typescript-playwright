import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class HiloGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get gameContainer(): Locator {
		return this.page.getByTestId("hilo-game-area-progress-bar-container");
	}

	public get spinningCountdownTimer(): Locator {
		return this.page.getByTestId("hilo-game-area-accepting-bets-spinning-in");
	}

	public get spinningCountdownStatus(): Locator {
		return this.page.getByTestId("hilo-game-area-accepting-bets-status");
	}

	public get yourBetField(): Locator {
		return this.page.getByTestId("hilo-bet-area-amount-input");
	}

	public get redButton(): Locator {
		return this.page.getByTestId("hilo-bet-area-bet-red");
	}

	public get blackButton(): Locator {
		return this.page.getByTestId("hilo-bet-area-bet-black");
	}

	public get jokerButton(): Locator {
		return this.page.getByTestId("hilo-bet-area-bet-joker");
	}

	public get gameResultLocator(): Locator {
		return this.page.getByTestId("hilo-game-area-after-name");
	}

	public get statsTableBody(): Locator {
		return this.page.getByTestId("game-stats-area-grid-tbody");
	}
}
