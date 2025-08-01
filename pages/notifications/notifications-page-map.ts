import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class NotificationsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public getNotificationByTitle(title: string): Locator {
		return this.page
			.locator("h6", { hasText: title })
			.locator("xpath=ancestor::div[4]");
	}

	public getNotificationTitle(title: string): Locator {
		return this.getNotificationByTitle(title).locator("h6").first();
	}

	public getNotificationDescription(title: string): Locator {
		return this.getNotificationByTitle(title).locator("p");
	}
}
