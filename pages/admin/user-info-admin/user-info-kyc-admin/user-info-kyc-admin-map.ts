import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class UserInfoKycAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public rowUserName(userName: string): Locator {
		return this.page.locator("a", { hasText: userName });
	}

	public rowContainer(userName: string): Locator {
		return this.rowUserName(userName).locator(
			'xpath=ancestor::div[contains(@class, "-with-background")]',
		);
	}

	public viewSubmissionButton(userName: string): Locator {
		return this.rowContainer(userName).locator("button", {
			hasText: "VIEW SUBMISION",
		});
	}

	public get approveButton(): Locator {
		return this.page.locator("button", {
			hasText: "Approve",
		});
	}
}
