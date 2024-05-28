import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { APIResponse } from "@playwright/test";
import { RegisterTestData } from "@dtos/test-data";
import { LoginRequest } from "@dtos/request/login-request";

export class GamdomApi extends BaseApi {
	private headers: Record<string, string> = {};

	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
	}

	public async register(
		payload: RegisterTestData,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		return this.post(
			"/signup",
			payload,
			_headers ? { ...this.headers, ..._headers } : this.headers,
		);
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

		return this.post(
			"/login2",
			payload,
			_headers ? { ...this.headers, ..._headers } : this.headers,
		);
	}
}
