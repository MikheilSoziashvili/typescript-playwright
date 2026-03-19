import { PocketDicePlaceBetOptions } from "@core/api/interfaces/pocket-dice-place-bet-options";
import { buildPocketDicePlaceBetEndpoint } from "@core/helpers/endpoint-builder";
import { PocketDicePlaceBetRequest } from "@dtos/requests/games-api/pocket-dice-api/place-bet-request";
import { GameCode } from "@enums/game-codes";
import { GameErrorMessage } from "@enums/game-error-messages";
import { OriginalGame } from "@enums/original-games";
import { PocketDiceApiBetOn, PocketDiceApiRollType } from "@enums/pocket-dice-api-enums";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";

export class PocketDiceApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.PocketDice,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
			gameCode: GameCode.POCKET_DICE,
		});
	}

	protected override async initSession(): Promise<void> {
		await this.fetchGameToken();
	}

	public async placeBet(
		amount: number,
		options?: PocketDicePlaceBetOptions,
	): Promise<APIResponse> {
		const {
			betOn = PocketDiceApiBetOn.FIVE,
			rollType = PocketDiceApiRollType.UNDER,
			isAutobet = false,
			headers,
		} = options ?? {};

		const payload: PocketDicePlaceBetRequest = {
			betOn: betOn,
			rollType: rollType,
			amountInUnit: amount,
			isAutobet: isAutobet,
			token: this.gameToken,
		};

		const endpoint = buildPocketDicePlaceBetEndpoint(this.gameToken);
		const parameters = this.buildParameters(endpoint, payload, headers);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		options?: PocketDicePlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() => this.placeBet(amount, options));
	}
}
