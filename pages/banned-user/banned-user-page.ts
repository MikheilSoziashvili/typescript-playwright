import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { BannedUserPageMap } from "./banned-user-page-map";
import { BannedUserPageAsserter } from "./banned-user-page-asserter";
import { BANNED_USER_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { VisibilityState } from "@enums/playwright/visibility-states";

export class BannedUserPage extends BasePage<BannedUserPageMap> {
	public constructor(page: Page) {
		super(page, new BannedUserPageMap(page));
	}

	public override async navigate(options: { param: string }): Promise<void> {
		await this.page.goto(`${BANNED_USER_PAGE_ENDPOINT}=${options.param}`);
	}

	public override assertThat(): BannedUserPageAsserter {
		return new BannedUserPageAsserter(this);
	}

	public async waitRedContainerToBeVisible(): Promise<void> {
		await this.map.waitFor({
			locator: this.map.redContainer,
			state: VisibilityState.VISIBLE,
		});
	}
}
