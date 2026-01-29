import { BaseMap } from "@base/base-map";
import { GameProvider } from "@enums/game-providers";
import { Locator, Page } from "@playwright/test";

export class ProvidersPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get providersContainer(): Locator {
		return this.page.locator(
			"div[class*='Providers-page-styled__Container']",
		);
	}

	public providerInProvidersContainer(gameProvider: GameProvider): Locator {
		return this.providersContainer.getByTestId(
			`providers-page-item-${gameProvider}`,
		);
	}
}
