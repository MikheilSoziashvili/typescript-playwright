import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { BannedUserPageMap } from "./banned-user-page-map";
import { BannedUserPageAsserter } from "./banned-user-page-asserter";
import { BANNED_USER_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class BannedUserPage extends BasePage<BannedUserPageMap> {
	public constructor(page: Page) {
		super(page, new BannedUserPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { path: BANNED_USER_PAGE_ENDPOINT },
		});
	}

	public override assertThat(): BannedUserPageAsserter {
		return new BannedUserPageAsserter(this);
	}

	public async waitRedContainerToBeVisible(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.redContainer,
		});
	}
}
