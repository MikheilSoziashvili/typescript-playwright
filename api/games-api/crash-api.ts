import { CrashPlaceBetOptions } from "@core/api/interfaces/crash-place-bet-options";
import { PlaceBetRequest } from "@dtos/requests/games-api/crash-api/place-bet-request";
import { ApiEndpoints } from "@enums/api-endpoints";
import { Currency } from "@enums/currencies";
import { GameErrorMessage } from "@enums/game-error-messages";
import { OriginalGame } from "@enums/original-games";
import { RequestType } from "@enums/request-type";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";

export class CrashApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.Crash,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
		});
	}

	public async placeBet(
		amount: number,
		autoCashOut: number,
		options?: CrashPlaceBetOptions,
	): Promise<APIResponse> {
		const {
			unit = Unit.COINS,
			displayCurrency = Currency.USD,
			walletType = WalletType.DEFAULT,
			headers,
		} = options ?? {};

		const payload: PlaceBetRequest = {
			type: RequestType.RPC,
			arg: {
				walletInfo: {
					amount: amount,
					unit: unit,
					displayCurrency: displayCurrency,
					wallet_type: walletType,
				},
				autoCashOut: autoCashOut,
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.CRASH_PLACE_BET,
			payload,
			headers,
		);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		autoCashOut: number,
		options?: CrashPlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() =>
			this.placeBet(amount, autoCashOut, options),
		);
	}
}
