import { Page } from "@playwright/test";
import { SteamAuthPageMap } from "./steam-auth-map";
import { BasePage } from "@pages/base/base-page";
import { SteamAuthPageAsserter } from "./steam-auth-page-asserter";
import { STEAM_AUTH_CREDENTIALS } from "@constants/credentials";
import { STEAM_LOGIN_URL } from "@constants/page-urls";

export class SteamAuthPage extends BasePage<SteamAuthPageMap> {
	public constructor(page: Page) {
		super(page, new SteamAuthPageMap(page));
	}
	public override async navigate(): Promise<void> {
		await this.page.goto(STEAM_LOGIN_URL);
	}

	public override assertThat(): SteamAuthPageAsserter {
		return new SteamAuthPageAsserter(this);
	}

	public async loginToSteam(
		username: string = STEAM_AUTH_CREDENTIALS.username,
		password: string = STEAM_AUTH_CREDENTIALS.password,
	): Promise<void> {
		await this.map.usernameTextInput.fill(username);
		await this.map.passwordTextInput.fill(password);
		await this.map.signInButton.click();
	}
}
