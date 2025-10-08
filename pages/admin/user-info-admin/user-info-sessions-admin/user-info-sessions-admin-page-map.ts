import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class UserInfoSessionsAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public getEndSessionButtonBySessionId(sessionId: string): Locator {
		return this.page
			.locator("tr", { hasText: sessionId })
			.locator("button", { hasText: "End session" });
	}
}
