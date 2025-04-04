import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CommunityConnectAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get communityConnectAdminPageContent(): Locator {
		return this.page.getByTestId("adminCommunityConnectPageContent");
	}

	public get changeFsCurrencyContainer(): Locator {
		return this.communityConnectAdminPageContent.getByTestId(
			"changeFsCurrencyContainer",
		);
	}

	public get changeFsCurrencyTitle(): Locator {
		return this.changeFsCurrencyContainer.getByTestId(
			"changeFsCurrencyTitle",
		);
	}
}
