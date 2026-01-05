import { FrameLocator, Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
export class BookOfPyramidsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get launcherIframeElement(): Locator {
		return this.page.locator('iframe[src*="ignition.button"]');
	}

	public get launcherFrame(): FrameLocator {
		return this.page.frameLocator('iframe[src*="ignition.button"]');
	}

	public get gameFrame(): FrameLocator {
		return this.launcherFrame.frameLocator(
			'iframe[src*="int.bgaming-system.com"]',
		);
	}

	public get spinButton(): Locator {
		return this.gameFrame.locator("#btn-spinDesktop");
	}

	public get totalWinValue(): Locator {
		return this.gameFrame.locator("#message .total-win-value").first();
	}

	public get maxBetButton(): Locator {
		return this.gameFrame.locator("#btn-maxBetDesktop");
	}

	public get totalBetValue(): Locator {
		return this.gameFrame.locator("#total-bet-value");
	}

	public get skipButton(): Locator {
		return this.gameFrame.locator("#btn-skipDesktop");
	}

	public get gameBalance(): Locator {
		return this.gameFrame.locator("#panel-balance-value");
	}
}
