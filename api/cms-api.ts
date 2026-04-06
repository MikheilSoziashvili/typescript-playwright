import { ApiEndpoints } from "@enums/api-endpoints";
import { expect } from "@playwright/test";
import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";

export class CmsApi extends BaseApi {
	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
		this.setHeaders({
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		});
	}

	public async loginAsCmsAdmin(username: string, password: string): Promise<string> {
		const parameters = this.buildParameters(ApiEndpoints.SAML_LOGIN, {
			username: username,
			password: password,
		});
		const response = await this.post(parameters);
		const setCookie = response.headers()["set-cookie"];

		expect(
			setCookie,
			`${setCookie ? "Cookie received" : "No cookie received"} from CMS login response`,
		).toBeTruthy();

		return setCookie;
	}
}
