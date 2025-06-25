import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { SteamAuthPageMap } from "./steam-auth-map";
import { BasePage } from "@pages/base/base-page";
import { SteamAuthPageAsserter } from "./steam-auth-page-asserter";
import * as Configuration from "configuration";
import { STEAM_LOGIN_URL } from "@constants/page-urls";
import { BasePageNavigationParametersType } from "@core/types/types";

export class SteamAuthPage extends BasePage<SteamAuthPageMap> {
	public constructor(page: Page) {
		super(page, new SteamAuthPageMap(page));
	}
	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [STEAM_LOGIN_URL] },
		});
	}

	public override assertThat(): SteamAuthPageAsserter {
		return new SteamAuthPageAsserter(this);
	}

	@step("Login to Steam")
	public async loginToSteam(
		username: string = Configuration.steam.username,
		password: string = Configuration.steam.password,
	): Promise<void> {
		await this.setExtraHTTPHeaders();
		await this.map.usernameTextInput.pressSequentially(username);
		await this.map.passwordTextInput.pressSequentially(password);
		await this.map.signInButton.click();
	}
}
