import { GamesBaseApiConfig } from "@core/api/interfaces/games-base-api-config";
import {
	buildGameInitEndpoint,
	buildStreamInitEndpoint,
} from "@core/helpers/endpoint-builder";
import { waitUntil } from "@core/utils/utils";
import { GameUrlRequest } from "@dtos/requests/games-api/game-url-request";
import { ApiEndpoints } from "@enums/api-endpoints";
import { Currency } from "@enums/currencies";
import { GameCode } from "@enums/game-codes";
import { HttpStatus } from "@enums/http-status";
import { RequestType } from "@enums/request-type";
import { Language } from "@enums/languages";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { APIResponse } from "@playwright/test";
import { logger } from "@logger/logger";
import { urlTokenPattern } from "@support/regex-patterns";
import * as Configuration from "../../configuration";
import { BaseApi } from "../base-api";

export abstract class GamesBaseApi extends BaseApi {
	protected readonly config: GamesBaseApiConfig;
	protected gameToken!: string;
	private sessionInitialized = false;

	constructor(
		config: GamesBaseApiConfig,
		base_url: string = Configuration.environment_url,
	) {
		super(base_url);
		this.config = config;
		this.setHeaders({
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		});
	}

	public async setToken(token: string): Promise<void> {
		this.gameToken = token;
		await this.initGameSession();
	}

	public async fetchGameToken(): Promise<string> {
		const token = await this.requestGameUrl();
		await this.setToken(token);
		return this.gameToken;
	}

	private getGameCode(): GameCode {
		if (!this.config.gameCode) {
			throw new Error(`Game code not configured for ${this.config.game}`);
		}

		return this.config.gameCode;
	}

	private async requestGameUrl(): Promise<string> {
		const payload: GameUrlRequest = {
			gameCode: this.getGameCode(),
			demo: false,
			mobile: false,
			lang: Language.EN,
			walletInfo: {
				amount: 0,
				unit: Unit.COINS,
				displayCurrency: Currency.USD,
				wallet_type: WalletType.DEFAULT,
			},
		};

		const parameters = this.buildParameters(ApiEndpoints.GAME_URL, payload);
		const response = await this.post(parameters);
		const body = await response.text();
		const match = body.match(urlTokenPattern);

		if (!match) {
			throw new Error(`No token found in game-url response: ${body}`);
		}

		return match[1];
	}

	private async initGameSession(): Promise<void> {
		const initEndpoint = buildGameInitEndpoint(
			this.config.game.toLowerCase(),
			this.gameToken,
		);
		const parameters = this.buildParameters(initEndpoint);
		await this.post(parameters);
	}

	private async ensureGameSession(): Promise<void> {
		if (this.sessionInitialized) {
			return;
		}

		await this.initSession();
		this.sessionInitialized = true;
	}

	protected async initSession(): Promise<void> {
		const endpoint = buildStreamInitEndpoint(
			this.config.game.toLowerCase(),
		);
		const payload = { type: RequestType.RPC };
		const parameters = this.buildParameters(endpoint, payload);
		await this.post(parameters);
	}

	protected async placeBetWithRetry(
		placeBet: () => Promise<APIResponse>,
	): Promise<APIResponse> {
		await this.ensureGameSession();
		let lastResponse!: APIResponse;

		const tryPlaceBet = async (): Promise<boolean> => {
			lastResponse = await placeBet();

			if (lastResponse.status() === HttpStatus.OK) {
				logger.info(`${this.config.game} bet placed successfully`);
				return true;
			}

			await this.verifyExpectedError(lastResponse);
			return false;
		};

		await waitUntil(tryPlaceBet, {
			errorMessage: `Failed to place ${this.config.game} bet within the betting window`,
			intervalSeconds: this.config.retryInterval,
			timeoutSeconds: this.config.retryTimeout,
		});

		return lastResponse;
	}

	private async verifyExpectedError(response: APIResponse): Promise<void> {
		const responseText = await response.text();

		if (!responseText.includes(this.config.errorMessage)) {
			throw new Error(
				`Unexpected ${this.config.game} bet error: ${responseText}`,
			);
		}

		logger.info(
			`${this.config.game} game in progress, waiting for next round...`,
		);
	}
}
