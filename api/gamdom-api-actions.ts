import { APIResponse, expect, Page } from "@playwright/test";
import { RegisterTestData } from "@dtos/test-data";
import { GamdomApi } from "./gamdom-api";
import { environment_url } from "configuration";
import { getCookieName, getCookieValue } from "@core/utils/utils";
import { RegisterTestDataParams } from "@core/interfaces";

export class GamdomApiActions {
	readonly page: Page;
	readonly api: GamdomApi;

	constructor(page: Page) {
		this.page = page;
		this.api = new GamdomApi();
	}

	private async setCookies(setCookie: string): Promise<void> {
		const domain = environment_url.split("://")[1];
		const cookie = [
			{
				name: getCookieName(setCookie),
				value: getCookieValue(setCookie),
				domain: domain,
				path: "/",
				httpOnly: true,
				secure: false,
			},
		];

		await this.page.context().addCookies(cookie);
	}

	public async registerUser(
		params: RegisterTestDataParams = {},
	): Promise<RegisterTestData> {
		const userData = new RegisterTestData(params);
		const registerResponse = await this.api.register(userData);
		expect(registerResponse.status(), "Register failed").toBe(200);

		return userData;
	}

	public async loginUser(
		username: string,
		password: string,
	): Promise<APIResponse> {
		const loginResponse = await this.api.login(username, password);
		expect(
			loginResponse.headers()["set-cookie"],
			"No cookies received from login response",
		).toBeTruthy();

		return loginResponse;
	}

	public async authenticateWithExistingUser(
		username: string,
		password: string,
	): Promise<void> {
		const loginResponse = await this.loginUser(username, password);

		const setCookie = loginResponse.headers()["set-cookie"];
		await this.setCookies(setCookie);
	}

	public async authenticateWithNewUser(
		params: RegisterTestDataParams = {},
	): Promise<void> {
		const userData = await this.registerUser(params);
		await this.authenticateWithExistingUser(
			userData.username,
			userData.password,
		);
	}
}
