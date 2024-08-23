import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { APIResponse } from "@playwright/test";
import { LoginRequest } from "@dtos/requests/gamdom-api/login-request";
import { RegisterRequest } from "@dtos/requests/gamdom-api/register-request";
import { RegisterTestData } from "@dtos/test-data";
import { SetFeatureStateRequest } from "@dtos/requests/gamdom-api/set-feature-state-request";
import { Feature } from "@enums/feature";

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

		const parameters = this.buildParameters(
			"/client-api/internalAuth/login",
			payload,
			_headers,
		);
		return this.post(parameters);
	}

	private async toggleFeature(
		feature: Feature,
		enable: boolean,
		isBeta: boolean,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: SetFeatureStateRequest = {
			feature: feature,
			enable: enable,
			isBeta: isBeta,
		};

		const parameters = this.buildParameters(
			"/client-api/admin/feature/setFeatureState",
			payload,
			_headers,
		);
		return this.post(parameters);
	}

	public async setFeatureState(
		feature: Feature,
		states: { regular: boolean; beta: boolean },
		_headers: Record<string, string> = {},
	): Promise<[APIResponse, APIResponse]> {
		const stateConfigs = [
			{ enable: states.regular, isBeta: false },
			{ enable: states.beta, isBeta: true },
		];

		const responses = await Promise.all(
			stateConfigs.map(({ enable, isBeta }) =>
				this.toggleFeature(feature, enable, isBeta, _headers),
			),
		);

		return responses as [APIResponse, APIResponse];
	}
}
