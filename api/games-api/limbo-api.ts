import { LimboPlaceBetOptions } from "@core/api/interfaces/limbo-place-bet-options";
import { buildLimboPlaceBetEndpoint } from "@core/helpers/endpoint-builder";
import { generateRandomString } from "@core/utils/utils";
import { LimboPlaceBetRequest } from "@dtos/requests/games-api/limbo-api/place-bet-request";
import { GameCode } from "@enums/game-codes";
import { GameErrorMessage } from "@enums/game-error-messages";
import { OriginalGame } from "@enums/original-games";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";

export class LimboApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.Limbo,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
			gameCode: GameCode.LIMBO,
		});
	}

	protected override async initSession(): Promise<void> {
		await this.fetchGameToken();
	}

	public async placeBet(
		amount: number,
		options?: LimboPlaceBetOptions,
	): Promise<APIResponse> {
		const {
			targetMultiplier = 2,
			isAutobet = false,
			refClientId = generateRandomString({
				prefix: "limbo-",
			}),
			headers,
		} = options ?? {};

		const payload: LimboPlaceBetRequest = {
			targetMultiplier: targetMultiplier,
			amountInUnit: amount,
			isAutobet: isAutobet,
			refClientId: refClientId,
			token: this.gameToken,
		};

		const endpoint = buildLimboPlaceBetEndpoint(this.gameToken);
		const parameters = this.buildParameters(endpoint, payload, headers);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		options?: LimboPlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() => this.placeBet(amount, options));
	}
}
