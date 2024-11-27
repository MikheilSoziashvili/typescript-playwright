import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { GameProvider } from "@enums/game-providers";
import { whiteSpacePattern } from "@support/regex-patterns";

export class ProvidersPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public providerOptionInContainer(gameProvider: GameProvider): Locator {
		// Replacing spaces with dash, because href is '/providers/OneTouch-Table-Game'
		const formattedProvider = gameProvider.replace(whiteSpacePattern, "-");
		return this.providersContainer.locator(
			`div a[href='/providers/${formattedProvider}']`,
		);
	}

	public get providersContainer(): Locator {
		return this.page.locator(
			"div[class*='ContainerAnimate'] > div[class*='MuiGrid2-container']",
		);
	}
}
