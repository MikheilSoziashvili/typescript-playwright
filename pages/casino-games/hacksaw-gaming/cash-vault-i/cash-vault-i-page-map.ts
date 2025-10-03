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
}
