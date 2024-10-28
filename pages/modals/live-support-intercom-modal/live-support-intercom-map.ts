import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
export class LiveSupportModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get liveSupportIntercomIframe(): Locator {
		return this.page.locator(
			`iframe[name="intercom-messenger-frame"]`,
		);
	}
}