import { buildBlackjackPlaceBetEndpoint } from "@core/helpers/endpoint-builder";
import { BlackjackPlaceBetRequest } from "@dtos/requests/games-api/blackjack-api/place-bet-request";
import { GameCode } from "@enums/game-codes";
import { GameErrorMessage } from "@enums/game-error-messages";
import { OriginalGame } from "@enums/original-games";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";

export class BlackjackApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.Blackjack,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
			gameCode: GameCode.BLACKJACK,
		});
	}

	protected override async initSession(): Promise<void> {
		await this.fetchGameToken();
	}

	public async placeBet(amount: number): Promise<APIResponse> {
		const payload: BlackjackPlaceBetRequest = {
			amountInUnit: amount,
			token: this.gameToken,
		};

		const endpoint = buildBlackjackPlaceBetEndpoint(this.gameToken);
		const parameters = this.buildParameters(endpoint, payload);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(amount: number): Promise<APIResponse> {
		return this.placeBetWithRetry(() => this.placeBet(amount));
	}
}
