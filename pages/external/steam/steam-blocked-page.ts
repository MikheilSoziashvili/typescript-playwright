import { Page } from "@playwright/test";
import { BasePage } from "@pages/base/base-page";
import { SteamBlockedPageMap } from "./steam-blocked-page-map";
import { SteamBlockedPageAsserter } from "./steam-blocked-page-asserter";
import { STEAM_BLOCKED_PAGE_URL } from "@constants/page-urls";

export class SteamBlockedPage extends BasePage<SteamBlockedPageMap> {
	public constructor(page: Page) {
		super(page, new SteamBlockedPageMap(page));
	}
	public override async navigate(): Promise<void> {
		await this.page.goto(STEAM_BLOCKED_PAGE_URL);
	}

	public override assertThat(): SteamBlockedPageAsserter {
		return new SteamBlockedPageAsserter(this);
	}

	public async continueAndSignIn(): Promise<void> {
		await this.map.continueAnywayButton.click();
		await this.map.signInButton.click();
	}
}
