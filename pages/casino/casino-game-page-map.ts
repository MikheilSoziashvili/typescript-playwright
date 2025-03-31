import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { GameProvider } from "@enums/game-providers";

export class CasinoPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public providerDropdownOption(gameProvider: GameProvider): Locator {
		return this.page.locator(
			`ul[class*='MuiMenu-list'] > li[data-value='${gameProvider}']`,
		);
	}

	public get providersDropdown(): Locator {
		return this.getSpanByClassContains("Dropdown-styled");
	}

	public get settingsButton(): Locator {
		return this.page.locator('button[aria-label="Settings"]');
	}

	public get providersDropdownInSettingsModal(): Locator {
		return this.page.locator(
			'div[class*="RandomPickSettingsModal-styled__ModalBody"] div[role="combobox"]',
		);
	}

	public get casinoGamesScrollbarContainer(): Locator {
		return this.page.locator(`div[role="tablist"]`);
	}

	public casinoGamesScrollbarItemByPlaceholder(
		scrollbarItem: string,
	): Locator {
		return this.casinoGamesScrollbarContainer.locator(`a[role='tab']`, {
			hasText: `${scrollbarItem}`,
		});
	}
}
