import { Page } from "@playwright/test";
import { BasePage } from "@pages/base/base-page";
import { SteamBlockedPageMap } from "./steam-blocked-page-map";
import { SteamBlockedPageAsserter } from "./steam-blocked-page-asserter";

export class SteamBlockedPage extends BasePage<SteamBlockedPageMap> {
	public constructor(page: Page) {
		super(page, new SteamBlockedPageMap(page));
	}
	public override assertThat(): SteamBlockedPageAsserter {
		return new SteamBlockedPageAsserter(this);
	}

	public async continueAndSignIn(): Promise<void> {
		await this.map.continueAnywayButton.click();
		await this.setExtraHTTPHeaders({
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		});
		await this.map.signInButton.click();
	}
}
