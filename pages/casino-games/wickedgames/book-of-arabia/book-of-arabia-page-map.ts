import { FrameLocator, Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
export class BookOfArabiaPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get outerFrameLocator(): FrameLocator {
		return this.page.frameLocator(
			'iframe[src*="wicked.games"][src*="/launch"]',
		);
	}

	public get gameFrame(): FrameLocator {
		return this.outerFrameLocator.frameLocator("#gameFrame");
	}

	public get continueButton(): Locator {
		return this.gameFrame.locator(".continue-button");
	}

	public get betContainer(): Locator {
		return this.gameFrame.locator(".bet-container");
	}

	public get betOptionsRoot(): Locator {
		return this.gameFrame.locator(".desktop-options");
	}

	public getBetOption(amount: number): Locator {
		return this.betOptionsRoot.locator(".description", {
			hasText: amount.toFixed(2),
		});
	}

	public get spinButton(): Locator {
		return this.gameFrame.locator('div[role="presentation"].spin-button');
	}
}
