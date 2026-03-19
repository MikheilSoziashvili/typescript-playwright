import { MinesPlaceBetOptions } from "@core/api/interfaces/mines-place-bet-options";
import { buildMinesPlaceBetEndpoint } from "@core/helpers/endpoint-builder";
import { MinesPlaceBetRequest } from "@dtos/requests/games-api/mines-api/place-bet-request";
import { GameCode } from "@enums/game-codes";
import { GameErrorMessage } from "@enums/game-error-messages";
import { MinesCount } from "@enums/mines/mines-count";
import { OriginalGame } from "@enums/original-games";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";

export class MinesApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.Mines,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
			gameCode: GameCode.MINES,
		});
	}

	protected override async initSession(): Promise<void> {
		await this.fetchGameToken();
	}

	public async placeBet(
		amount: number,
		options?: MinesPlaceBetOptions,
	): Promise<APIResponse> {
		const { minesCount = MinesCount.N1, isAutobet = false, headers } = options ?? {};

		const payload: MinesPlaceBetRequest = {
			minesCount: minesCount,
			amountInUnit: amount,
			isAutobet: isAutobet,
			token: this.gameToken,
		};

		const endpoint = buildMinesPlaceBetEndpoint(this.gameToken);
		const parameters = this.buildParameters(endpoint, payload, headers);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		options?: MinesPlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() => this.placeBet(amount, options));
	}
}
