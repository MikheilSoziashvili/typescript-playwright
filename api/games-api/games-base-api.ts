import { GamesBaseApiConfig } from "@core/api/interfaces/games-base-api-config";
import { waitUntil } from "@core/utils/utils";
import { HttpStatus } from "@enums/http-status";
import { APIResponse } from "@playwright/test";
import { logger } from "@logger/logger";
import * as Configuration from "../../configuration";
import { BaseApi } from "../base-api";

export abstract class GamesBaseApi extends BaseApi {
	private readonly config: GamesBaseApiConfig;

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

	protected async placeBetWithRetry(
		placeBet: () => Promise<APIResponse>,
	): Promise<APIResponse> {
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
