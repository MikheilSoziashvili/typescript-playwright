import { FrameLocator, Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import {
	BaccaratBetSpot,
	BaccaratChipValue,
} from "@enums/baccarat-game-options";

export class LiveBaccaratSqueezePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get launcherFrame(): FrameLocator {
		return this.page.frameLocator('iframe[src*="launcher"]');
	}

	public get gameFrame(): FrameLocator {
		return this.launcherFrame.frameLocator(
			'iframe[src*="coingaming"][src*="provider=evolution"]',
		);
	}

	public get footerContainer(): Locator {
		return this.gameFrame.locator(
			'[data-role="footer-perspective-container"]',
		);
	}

	public get topCornerGradient(): Locator {
		return this.gameFrame.locator('[data-role="top-corner-gradient"]');
	}

	public get betsContainerAvailable(): Locator {
		return this.gameFrame.locator(
			'[data-role="footer-perspective-container"][data-is-collapsed="false"]',
		);
	}

	public get betsContainerUnavailable(): Locator {
		return this.gameFrame.locator(
			'[data-role="footer-perspective-container"][data-is-collapsed="true"]',
		);
	}

	public get bettingGridContainer(): Locator {
		return this.gameFrame.locator('[data-role="betting-grid-container"]');
	}

	public getBetSpot(betSpot: BaccaratBetSpot): Locator {
		return this.gameFrame.locator(
			`[data-betspot-destination="${betSpot}"]`,
		);
	}

	public get chipsStackAvailableContainer(): Locator {
		return this.gameFrame.locator(
			'[data-role="footer-perspective-chip-stack"][data-is-collapsed="false"]',
		);
	}

	public get playerChipsStack(): Locator {
		return this.gameFrame.locator('[data-role="chip-stack"]');
	}

	public getChip(chipValue: BaccaratChipValue): Locator {
		return this.playerChipsStack.locator(
			`[data-role="chip"][data-value="${chipValue}"]`,
		);
	}

	public get gameStartTimer(): Locator {
		return this.gameFrame.locator('[data-role="circle-timer"]');
	}

	public get gameResultContainer(): Locator {
		return this.gameFrame.locator('[class*="gameResultContainer"]');
	}

	public get gameResultWinner(): Locator {
		return this.gameFrame.locator('[data-role="game-result-winner"]');
	}

	public get gameResultMessage(): Locator {
		return this.gameFrame.locator('[data-role="winning-message-text"]');
	}

	public get gameResultAmount(): Locator {
		return this.gameFrame.locator('[data-role="winning-message-amount"]');
	}

	public get screenNamePopup(): Locator {
		return this.gameFrame.locator('[data-role="screen-name"]');
	}

	public get screenNameInput(): Locator {
		return this.gameFrame.locator("#screenNameInput");
	}

	public get screenNameSaveButton(): Locator {
		return this.gameFrame.locator('[data-role="button-save"]');
	}
}
