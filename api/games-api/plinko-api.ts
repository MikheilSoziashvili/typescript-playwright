import { PlinkoPlaceBetOptions } from "@core/api/interfaces/plinko-place-bet-options";
import { buildPlinkoPlaceBetEndpoint } from "@core/helpers/endpoint-builder";
import { PlinkoPlaceBetRequest } from "@dtos/requests/games-api/plinko-api/place-bet-request";
import { PlinkoHealthcheckResponse } from "@dtos/responses/games-api/plinko-api/healthcheck-response";
import { ApiEndpoints } from "@enums/api-endpoints";
import { GameCode } from "@enums/game-codes";
import { GameErrorMessage } from "@enums/game-error-messages";
import { OriginalGame } from "@enums/original-games";
import { PlinkoRisk } from "@enums/plinko/plinko-risk";
import { PlinkoRowsOption } from "@enums/plinko/plinko-game-options";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";
import { generateRandomString } from "@core/utils/utils";

export class PlinkoApi extends GamesBaseApi {
	private cachedClientVersion?: string;

	constructor() {
		super({
			game: OriginalGame.Plinko,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
			gameCode: GameCode.PLINKO,
		});
	}

	protected override async initSession(): Promise<void> {
		await this.fetchGameToken();
	}

	private async getClientVersion(): Promise<string> {
		if (this.cachedClientVersion) {
			return this.cachedClientVersion;
		}

		const parameters = this.buildParameters(
			ApiEndpoints.PLINKO_HEALTHCHECK,
		);
		const response = await this.get(parameters);
		const body = (await response.json()) as PlinkoHealthcheckResponse;
		this.cachedClientVersion = body.version;

		return this.cachedClientVersion;
	}

	public async placeBet(
		amount: number,
		options?: PlinkoPlaceBetOptions,
	): Promise<APIResponse> {
		const {
			risk = PlinkoRisk.MEDIUM,
			rows = PlinkoRowsOption.ROWS_12,
			isAutobet = false,
			refClientId = generateRandomString({
				prefix: "plinko-",
			}),
			headers,
		} = options ?? {};

		const clientVersion =
			options?.clientVersion ?? (await this.getClientVersion());

		const payload: PlinkoPlaceBetRequest = {
			risk: risk,
			rows: rows,
			token: this.gameToken,
			isAutobet: isAutobet,
			amountInUnit: amount,
			refClientId: refClientId,
			clientVersion: clientVersion,
		};

		const endpoint = buildPlinkoPlaceBetEndpoint(this.gameToken);
		const parameters = this.buildParameters(endpoint, payload, headers);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		options?: PlinkoPlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() => this.placeBet(amount, options));
	}
}
