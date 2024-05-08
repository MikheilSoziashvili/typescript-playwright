import { Page } from "@playwright/test";
import { BasePage } from "base/base-page";
import { GooglePageMap } from "./google-page-map";
import { GoogleAuthPageAsserter } from "./google-auth-asserter";
import { GOOGLE_AUTH_CREDENTIALS } from "constants/credentials";

export class GoogleAuthPage extends BasePage<GooglePageMap> {
	public constructor(page: Page) {
		super(page, new GooglePageMap(page));
	}
	public override async navigate(): Promise<void> {
		await this.page.goto("/");
	}

	public override assertThat(): GoogleAuthPageAsserter {
		return new GoogleAuthPageAsserter(this);
	}

	// Deprecated - used when Google login was required to pass Cloudflare auth - now done via Cloudflare Client ID & Client Secret headers
	public async loginToGoogle(
		username: string = GOOGLE_AUTH_CREDENTIALS.username,
		password: string = GOOGLE_AUTH_CREDENTIALS.password,
	): Promise<void> {
		await this.map.gEmailField.fill(username);
		await this.map.gMoveForwardBtn.click();
		await this.map.gPasswordField.fill(password);
		await this.map.gPasswordNextBtn.click();
	}
}
