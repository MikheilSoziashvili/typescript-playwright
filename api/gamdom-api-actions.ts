import { expect, Page } from "@playwright/test";
import { RegisterTestData } from "@dtos/test-data";
import { GamdomApi } from "./gamdom-api";
import { STAGING_BASE_URL } from "@constants/page-urls";

export class GamdomApiActions {
	readonly page: Page;
	readonly api: GamdomApi;

	constructor(page: Page) {
		this.page = page;
		this.api = new GamdomApi();
	}

	private async setCookies(setCookie: string): Promise<void> {
		const cookieName = setCookie.split("=")[0];
		const cookieValue = setCookie.split("=")[1].split(";")[0];
		const domain = STAGING_BASE_URL.split("://")[1];
		const cookie = [
			{
				name: cookieName,
				value: cookieValue,
				domain: domain,
				path: "/",
				httpOnly: true,
				secure: false,
			},
		];

		await this.page.context().addCookies(cookie);
	}

	public async authenticateWithNewUser(
		userData: RegisterTestData,
	): Promise<void> {
		const registerResponse = await this.api.register(userData);
		expect(registerResponse.status(), "Register failed").toBe(200);

		const loginResponse = await this.api.login(
			userData.username,
			userData.password,
		);
		expect(
			loginResponse.headers()["set-cookie"],
			"No cookies received from login response",
		).toBeTruthy();

		const setCookie = loginResponse.headers()["set-cookie"];
		await this.setCookies(setCookie);
	}

	public async clearCookies(): Promise<void> {
		await this.page.context().clearCookies();
	}
}
