import { APIResponse, expect } from "@playwright/test";
import * as Configuration from "../configuration";
import { LoginRequest } from "@dtos/requests/gamdom-api/login-request";
import { RegisterRequest } from "@dtos/requests/gamdom-api/register-request";
import { RegisterTestData } from "@dtos/test-data";
import { SetFeatureStateRequest } from "@dtos/requests/gamdom-api/set-feature-state-request";
import { Feature } from "@enums/feature";
import { BaseApi } from "./base-api";
import { TipUserRequest } from "@dtos/requests/gamdom-api/tip-user-request";
import { BasicInfoResponse } from "@dtos/responses/gamdom-api/basic-info-response";
import { formatDate, getCookieHeader } from "@core/utils/utils";
import { ApiEndpoints } from "@enums/api-endpoints";
import { SetProviderStateRequest } from "@dtos/requests/gamdom-api/set-provider-state-request";
import {
	EditUserData,
	EditUserInfoRequest,
} from "@dtos/requests/gamdom-api/edit-user-info-request";
import { GetProvidersResponse } from "@dtos/responses/gamdom-api/get-providers-response";
import { CreateKothEventRequest } from "@dtos/requests/gamdom-api/create-koth-event-request";
import { EnableRainRequest } from "@dtos/requests/enable-rain-request";
import { HttpStatus } from "@enums/http-status";

export class GamdomApi extends BaseApi {
	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
		this.setHeaders({
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
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

		const parameters = this.buildParameters(
			ApiEndpoints.REGISTER,
			payload,
			_headers,
		);
		return this.post(parameters);
	}

	public async login(
		username: string,
		password?: string,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: LoginRequest = {
			username: username,
			password: password,
			captcha_solution: "captcha",
			totp_token: "",
		};

		const parameters = this.buildParameters(
			ApiEndpoints.LOGIN,
			payload,
			_headers,
		);
		return this.post(parameters);
	}

	public async authenticateWithExistingUser(
		username: string,
		password: string,
	): Promise<string> {
		const loginResponse = await this.login(username, password);
		const setCookie = loginResponse.headers()["set-cookie"];

		expect(
			setCookie,
			"No cookies received from login response",
		).toBeTruthy();

		return setCookie;
	}

	public async authenticateWithNewUser(
		userData: RegisterTestData,
	): Promise<string> {
		await this.registerUser(userData);
		return this.authenticateWithExistingUser(
			userData.username,
			userData.password,
		);
	}

	private async registerUser(
		userData: RegisterTestData,
	): Promise<APIResponse> {
		const registerResponse = await this.register(userData);
		expect(registerResponse.status(), "Register failed").toBe(
			HttpStatus.OK,
		);

		return registerResponse;
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
			ApiEndpoints.SETFEATURESTATE,
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

	public async setProviderState(
		id: number,
		provider_name: string,
		disabled: boolean,
		beta_users_only: boolean,
		provider_id: string,
		imported_from: string,
		_headers: Record<string, string> = {},
	): Promise<APIResponse> {
		const payload: SetProviderStateRequest = [
			{
				id: id,
				provider_name: provider_name,
				priority: 0,
				disabled: disabled,
				provider_id: provider_id,
				imported_from: imported_from,
				beta_users_only: beta_users_only,
			},
		];

		const parameters = this.buildParameters(
			ApiEndpoints.SETPROVIDERSTATE,
			payload,
			_headers,
		);

		return this.post(parameters);
	}

	public async getProviders(
		_headers: Record<string, string> = {},
	): Promise<GetProvidersResponse> {
		const parameters = this.buildParameters(
			ApiEndpoints.GETPROVIDERS,
			undefined,
			_headers,
		);

		const response = await this.post(parameters);

		const data = (await response.json()) as GetProvidersResponse;
		return data;
	}

	public async getBasicInfo(
		username: string,
		password: string,
	): Promise<BasicInfoResponse> {
		const cookie = getCookieHeader(
			await this.authenticateWithExistingUser(username, password),
		);

		const parameters = this.buildParameters(
			ApiEndpoints.BASICINFO,
			undefined,
			{ Cookie: cookie },
		);

		const response = await this.post(parameters);
		return response.json() as Promise<BasicInfoResponse>;
	}

	/**
	 * Edits user information by updating various user attributes.
	 *
	 * @param userid - The ID of the user to edit.
	 * @param tags - A string containing tags associated with the user.
	 * @param email - The user's email address.
	 * @param _headers - Optional headers for the API request.
	 * @param options - An optional object containing additional user information fields.
	 * @param options.userclass - The user's class (default: "user").
	 * @param options.email_consent - Indicates if the user has given email consent (default: true).
	 * @param options.wager_req_start - The start date of the wager requirement (default: null).
	 * @param options.wager_req_end - The end date of the wager requirement (default: null).
	 * @param options.gmail_id - The Gmail ID of the user (default: null).
	 * @param options.wallet_differences - An array representing wallet differences (default: []).
	 * @param options.sendUpdateToUser - Whether to send an update to the user (default: true).
	 * @returns A promise that resolves to an APIResponse object.
	 */
	public async editUserInfo(
		userid: number,
		tags: string,
		email: string,
		_headers: Record<string, string> = {},
		options: {
			userclass?: string;
			email_consent?: boolean;
			wager_req_start?: Date | string | null;
			wager_req_end?: Date | string | null;
			gmail_id?: string | null;
			wallet_differences?: unknown[];
			sendUpdateToUser?: boolean;
		} = {},
	): Promise<APIResponse> {
		const {
			userclass = "user",
			email_consent = true,
			wager_req_start = null,
			wager_req_end = null,
			gmail_id = null,
			wallet_differences = [],
			sendUpdateToUser = true,
		} = options;

		const data: EditUserData = {
			userclass: userclass,
			tags: tags,
			email: email.toLowerCase(),
			email_consent: email_consent,
			wager_req_start: wager_req_start,
			wager_req_end: wager_req_end,
			gmail_id: gmail_id,
			wallet_differences: wallet_differences,
		};

		const payload: EditUserInfoRequest = {
			userid: userid,
			sendUpdateToUser: sendUpdateToUser,
			data: data,
		};

		const parameters = this.buildParameters(
			ApiEndpoints.EDITUSERINFO,
			payload,
			_headers,
		);

		return this.post(parameters);
	}

	public async tipUser(
		userId: number,
		amount: number,
		unit: string,
		displayCurrency: string,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: TipUserRequest = {
			type: "rpc",
			arg: {
				toId: userId,
				walletInfo: {
					amount: amount,
					unit: unit,
					displayCurrency: displayCurrency,
				},
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.TIPUSER,
			payload,
			_headers,
		);

		return this.post(parameters);
	}

	public async createKothEvent(
		event_name: string,
		max_winners: number,
		prize_coins: number,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: CreateKothEventRequest = {
			start_date: formatDate(),
			end_date: formatDate(1),
			event_name: event_name,
			event_type: "MANUAL",
			max_winners: max_winners,
			prize_coins: prize_coins,
		};

		const parameters = this.buildParameters(
			ApiEndpoints.CREATEKOTH,
			payload,
			_headers,
		);
		return this.post(parameters);
	}

	public async enableRain(
		active: boolean,
		extraAmount: number,
		frequencyMins: number,
		maxAmount: number,
		minAmount: number,
		percentExtraAmount: number,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: EnableRainRequest = {
			type: "rpc",
			arg: {
				announcementDate: formatDate(),
				customData: {
					active: active,
					extraAmount: extraAmount,
					frequencyMins: frequencyMins,
					maxAmount: maxAmount,
					minAmount: minAmount,
					name: "Free Money",
					percentExtraAmount: percentExtraAmount,
				},
				type: "custom",
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.ENABLERAIN,
			payload,
			_headers,
		);
		return this.post(parameters);
	}
}
