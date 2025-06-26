import { formatDate, getCookieHeader } from "@core/utils/utils";
import { EnableRainRequest } from "@dtos/requests/enable-rain-request";
import { CreateKothEventRequest } from "@dtos/requests/gamdom-api/create-koth-event-request";
import {
	EditUserData,
	EditUserInfoRequest,
} from "@dtos/requests/gamdom-api/edit-user-info-request";
import { LoginRequest } from "@dtos/requests/gamdom-api/login-request";
import { RegisterRequest } from "@dtos/requests/gamdom-api/register-request";
import { SetFeatureStateRequest } from "@dtos/requests/gamdom-api/set-feature-state-request";
import { SetProviderStateRequest } from "@dtos/requests/gamdom-api/set-provider-state-request";
import { TipUserRequest } from "@dtos/requests/gamdom-api/tip-user-request";
import { BasicInfoResponse } from "@dtos/responses/gamdom-api/basic-info-response";
import { GetProvidersResponse } from "@dtos/responses/gamdom-api/get-providers-response";
import { RegisterTestData } from "@dtos/test-data";
import { ApiEndpoints } from "@enums/api-endpoints";
import { Feature } from "@enums/feature";
import { HttpStatus } from "@enums/http-status";
import { logger } from "@logger/logger";
import { RainDTO } from "@dtos/responses/gamdom-api/get-open-rains-response";
import { APIResponse, expect } from "@playwright/test";
import { GamdomDb } from "database/gamdom-db";
import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";
import { RainOptions, RainResponse } from "@core/types/types";
import { RainStatus } from "@enums/rain-status";
import { KothEventDTO } from "@dtos/responses/gamdom-api/get-current-koth-events-basic-info-response";
import { GetCryptoAdminTransactionsResponse } from "@dtos/responses/gamdom-api/get-crypto-admin-transactions-response";
import { GetCryptoAdminTransactionsRequest } from "@dtos/requests/gamdom-api/get-crypto-admin-transactions-request";
import { UserType } from "@enums/user-types";
import { GetAllRedirectsResponse } from "@dtos/responses/gamdom-api/get-all-redirects-response";
import { CreateRedirectRequest } from "@dtos/requests/gamdom-api/create-redirect-request";

export class GamdomApi extends BaseApi {
	private gamdomDb: GamdomDb;

	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
		this.setHeaders({
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		});
		this.gamdomDb = new GamdomDb();
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
			`${
				setCookie ? "Cookie received" : "No cookies received"
			} from login response`,
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

	public async authenticateWithNewSuperAdminUser(
		userData: RegisterTestData,
	): Promise<string> {
		await this.registerUser(userData);

		const newUserId = (
			await this.getBasicInfo(userData.username, userData.password)
		).user.id;

		await this.gamdomDb.withClient(async (client) => {
			await this.gamdomDb.makeUserSuperAdmin(newUserId, client);
			await this.gamdomDb.updateUserEmailVerification(
				newUserId,
				true,
				client,
			);
			await this.gamdomDb.updateUserTotalDepositedAmountByUserId(
				newUserId,
				300,
				client,
			);
			await this.gamdomDb.insertUserWallet(
				newUserId,
				undefined,
				undefined,
				true,
				client,
			);
		});

		return this.authenticateWithExistingUser(
			userData.username,
			userData.password,
		);
	}

	public async authenticateWithNewVerifiedUser(
		userData: RegisterTestData,
	): Promise<string> {
		await this.registerUser(userData);
		const newUserId = (
			await this.getBasicInfo(userData.username, userData.password)
		).user.id;
		await this.gamdomDb.withClient(async (client) => {
			await this.gamdomDb.updateUserEmailVerification(
				newUserId,
				true,
				client,
			);
			await this.gamdomDb.updateUserXP(
				newUserId,
				undefined,
				true,
				client,
			);
		});
		return this.authenticateWithExistingUser(
			userData.username,
			userData.password,
		);
	}

	public async registerUser(
		userData: RegisterTestData,
	): Promise<APIResponse> {
		const registerResponse = await this.register(userData);
		expect(
			registerResponse.status(),
			`${
				registerResponse.status()
					? "Register successful"
					: "Register failed"
			}`,
		).toBe(HttpStatus.OK);

		return registerResponse;
	}

	private async toggleFeature(
		enable: boolean,
		feature: Feature,
		userType: UserType,
		_headers: Record<string, string> = {},
	): Promise<APIResponse> {
		const payload: SetFeatureStateRequest = {
			feature,
			enable,
			userType,
		};

		const parameters = this.buildParameters(
			ApiEndpoints.SET_FEATURE_STATE,
			payload,
			_headers,
		);

		return this.post(parameters);
	}

	/**
	 * Enable / disable a feature for any combination of user types.
	 *
	 * Example:
	 *   await client.setFeatureState('PLINKO', {
	 *     [UserType.BETA]: true,
	 *     [UserType.QA_USER]: false,
	 *   });
	 */
	public async setFeatureState(
		feature: Feature,
		states: Partial<Record<UserType, boolean>>,
		_headers: Record<string, string> = {},
	): Promise<APIResponse[]> {
		const stateConfigs = Object.entries(states).map(
			([userType, enable]) => ({
				userType: userType as UserType,
				enable: Boolean(enable),
			}),
		);

		return Promise.all(
			stateConfigs.map(({ userType, enable }) =>
				this.toggleFeature(enable, feature, userType, _headers),
			),
		);
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
			ApiEndpoints.SET_PROVIDER_STATE,
			payload,
			_headers,
		);

		return this.post(parameters);
	}

	public async getProviders(
		_headers: Record<string, string> = {},
	): Promise<GetProvidersResponse> {
		const parameters = this.buildParameters(
			ApiEndpoints.GET_PROVIDERS,
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
			ApiEndpoints.BASIC_INFO,
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
			ApiEndpoints.EDIT_USER_INFO,
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
			ApiEndpoints.TIP_USER,
			payload,
			_headers,
		);

		return this.post(parameters);
	}

	public async createKothEvent(
		event_name: string,
		max_winners: number,
		prize_coins: number,
		game_code: string | null = null,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: CreateKothEventRequest = {
			start_date: formatDate(),
			end_date: formatDate(1),
			event_name: event_name,
			event_type: "MANUAL",
			max_winners: max_winners,
			prize_coins: prize_coins,
			game_code: game_code,
		};

		const parameters = this.buildParameters(
			ApiEndpoints.CREATE_KOTH,
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
			ApiEndpoints.ENABLE_RAIN,
			payload,
			_headers,
		);
		return this.post(parameters);
	}

	public async getOpenRains(
		_headers?: Record<string, string>,
	): Promise<RainDTO[]> {
		const parameters = this.buildParameters(
			ApiEndpoints.GET_OPEN_RAINS,
			undefined,
			_headers,
		);

		const response = await this.post(parameters);
		return (await response.json()) as RainDTO[];
	}

	public async ensureRainExists({
		active,
		extraAmount,
		frequencyMins,
		maxAmount,
		minAmount,
		percentExtraAmount,
		headers,
	}: RainOptions): Promise<RainResponse> {
		const openRains = await this.getOpenRains(headers);

		if (Array.isArray(openRains) && openRains.length > 0) {
			logger.info("Rain is already active.");
			return RainStatus.ALREADY_ACTIVE;
		}

		logger.info("Setting up a new rain configuration..");

		return this.enableRain(
			active,
			extraAmount,
			frequencyMins,
			maxAmount,
			minAmount,
			percentExtraAmount,
			headers,
		);
	}

	public async stopCustomRain(
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload = {
			type: "rpc",
			arg: {
				type: "all",
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.STOP_CUSTOM_RAIN,
			payload,
			_headers,
		);
		return this.post(parameters);
	}

	public async fetchLastKothEventId(
		_headers?: Record<string, string>,
	): Promise<number> {
		const parameters = this.buildParameters(
			ApiEndpoints.GET_LAST_KOTH_EVENT_ID,
			undefined,
			_headers,
		);

		const response = await this.post(parameters);
		return response.json() as Promise<number>;
	}

	public async getCurrentKothEventsBasicInfo(
		_headers?: Record<string, string>,
	): Promise<KothEventDTO[]> {
		const parameters = this.buildParameters(
			ApiEndpoints.GET_CURRENT_KOTH_EVENTS_BASIC_INFO,
			undefined,
			_headers,
		);

		const response = await this.post(parameters);
		return response.json() as Promise<KothEventDTO[]>;
	}

	public async getLastKothEventName(
		headers: Record<string, string>,
	): Promise<string> {
		const events = await this.getCurrentKothEventsBasicInfo(headers);

		if (!events.length) {
			throw new Error("No KOTH events found");
		}

		return events[events.length - 1].event_name;
	}

	public async getCryptoAdminTransactions(
		_headers?: Record<string, string>,
		limit = 100,
		oldestFirst = false,
	): Promise<GetCryptoAdminTransactionsResponse[]> {
		const payload: GetCryptoAdminTransactionsRequest = {
			limit,
			oldestFirst,
		};
		const parameters = this.buildParameters(
			ApiEndpoints.GET_CRYPTO_ADMIN_TRANSACTIONS,
			payload,
			_headers,
		);

		const response = await this.post(parameters);
		return response.json() as Promise<GetCryptoAdminTransactionsResponse[]>;
	}

	public async getAllRedirects(
		_headers?: Record<string, string>,
	): Promise<GetAllRedirectsResponse[]> {
		const parameters = this.buildParameters(
			ApiEndpoints.GET_ALL_REDIRECTS,
			undefined,
			_headers,
		);

		const response = await this.post(parameters);
		return response.json() as Promise<GetAllRedirectsResponse[]>;
	}

	public async createRedirect(
		fromPath: string,
		toPath: string,
		_headers?: Record<string, string>,
	): Promise<APIResponse> {
		const payload: CreateRedirectRequest = {
			redirect: {
				from_path: fromPath,
				to_path: toPath,
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.CREATE_REDIRECT,
			payload,
			_headers,
		);

		return this.post(parameters);
	}

	public async ensureRedirectExists(
		fromPath: string,
		toPath: string,
		cookie: string,
	): Promise<void> {
		this.setHeaders({
			Cookie: cookie,
		});

		const existing = await this.getAllRedirects();
		const alreadyExists = existing.some((r) => r.from_path === fromPath);

		if (!alreadyExists) {
			logger.info(
				`Redirect not found, creatig one from ${fromPath} to ${toPath}`,
			);
			await this.createRedirect(fromPath, toPath);
		}
	}
}
