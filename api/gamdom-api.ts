import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { APIResponse } from "@playwright/test";
import { LoginRequest } from "@dtos/requests/gamdom-api/login-request";
import { RegisterRequest } from "@dtos/requests/gamdom-api/register-request";
import { RegisterTestData } from "@dtos/test-data";

export class GamdomApi extends BaseApi {
	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
		this.setHeaders({
			"Content-Type": "application/json",
		});
	}

	public async register(
		userData: RegisterTestData,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: RegisterRequest = {
			username: userData.username,
			password: userData.password,
			email: userData.email,
			email_consent_checked: true,
			captcha_solution: "captcha",
			totp_token: "",
		};

		const parameters = this.buildParameters("/signup", payload, _headers);
		return this.post(parameters);
	}

	public async login(
		username: string,
		password: string,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: LoginRequest = {
			username: username,
			password: password,
			captcha_solution: "captcha",
			totp_token: "",
		};

		const parameters = this.buildParameters("/login2", payload, _headers);
		return this.post(parameters);
	}
}
