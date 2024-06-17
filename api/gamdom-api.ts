import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { APIResponse } from "@playwright/test";
import { RequestParameters } from "./request-parameters";
import { LoginRequest } from "@dtos/requests/gamdom-api/login-request";
import { RegisterRequest } from "@dtos/requests/gamdom-api/register-request";

export class GamdomApi extends BaseApi {
	private headers: Record<string, string> = {};

	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
	}

	public async register(
		payload: RegisterRequest,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const parameters: RequestParameters = {
			endpoint: "/signup",
			headers: _headers ? { ...this.headers, ..._headers } : this.headers,
			data: payload,
		};
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

		const parameters: RequestParameters = {
			endpoint: "/login2",
			headers: _headers ? { ...this.headers, ..._headers } : this.headers,
			data: payload,
		};
		return this.post(parameters);
	}
}
