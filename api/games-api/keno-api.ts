import { KenoPlaceBetOptions } from "@core/api/interfaces/keno-place-bet-options";
import { buildKenoPlaceBetEndpoint } from "@core/helpers/endpoint-builder";
import { KenoPlaceBetRequest } from "@dtos/requests/games-api/keno-api/place-bet-request";
import { GameCode } from "@enums/game-codes";
import { GameErrorMessage } from "@enums/game-error-messages";
import { KenoRisk } from "@enums/keno/keno-risk";
import { KenoSelectedNumber } from "@enums/keno/keno-selected-numbers";
import { OriginalGame } from "@enums/original-games";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";
import { generateRandomString } from "@core/utils/utils";

export class KenoApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.Keno,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
			gameCode: GameCode.KENO,
		});
	}

	protected override async initSession(): Promise<void> {
		await this.fetchGameToken();
	}

	public async placeBet(
		amount: number,
		options?: KenoPlaceBetOptions,
	): Promise<APIResponse> {
		const {
			selectedNumbers = [KenoSelectedNumber.N1, KenoSelectedNumber.N2],
			risk = KenoRisk.MEDIUM,
			isAutobet = false,
			refClientId = generateRandomString({
				prefix: "keno-",
			}),
			headers,
		} = options ?? {};

		const payload: KenoPlaceBetRequest = {
			selectedNumbers: selectedNumbers,
			amountInUnit: amount,
			isAutobet: isAutobet,
			risk: risk,
			refClientId: refClientId,
			token: this.gameToken,
		};

		const endpoint = buildKenoPlaceBetEndpoint(this.gameToken);
		const parameters = this.buildParameters(endpoint, payload, headers);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		options?: KenoPlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() => this.placeBet(amount, options));
	}
}
