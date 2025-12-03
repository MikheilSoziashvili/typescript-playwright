import { FrameLocator, Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
export class CashVaultIPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get gameFrame(): FrameLocator {
		return this.page.frameLocator(
			'iframe[src*="static-stg.hacksawgaming.com/launcher/static-launcher.html"]',
		);
	}

	public get gameBalance(): Locator {
		return this.gameFrame.locator("#BalanceValue");
	}

	public get actionsButtonContainer(): Locator {
		return this.gameFrame.locator("#ActionPanel");
	}

	public get buyButton(): Locator {
		return this.actionsButtonContainer.locator("#PlaceBetBtn");
	}

	public get scratchAllButton(): Locator {
		return this.actionsButtonContainer.locator("#StopBtn");
	}

	public get feedbackMessageContainer(): Locator {
		return this.gameFrame.locator("#FeedbackMsg");
	}

	public get wonLabel(): Locator {
		return this.feedbackMessageContainer.locator(
			'[data-main-field="win-amount"]',
			{
				hasText: "YOU WON $",
			},
		);
	}
}
