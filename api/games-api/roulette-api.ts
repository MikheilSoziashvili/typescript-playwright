import { RoulettePlaceBetOptions } from "@core/api/interfaces/roulette-place-bet-options";
import { RoulettePlaceBetRequest } from "@dtos/requests/games-api/roulette-api/place-bet-request";
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

export class RouletteApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.Roulette,
			errorMessage: GameErrorMessage.BET_AFTER_START,
			retryInterval: TimeoutSeconds.TWO,
			retryTimeout: TimeoutSeconds.THIRTY,
		});
	}

	public async placeBet(
		amount: number,
		betOption: string,
		options?: RoulettePlaceBetOptions,
	): Promise<APIResponse> {
		const {
			isAutobet = false,
			unit = Unit.COINS,
			displayCurrency = Currency.USD,
			walletType = WalletType.DEFAULT,
			headers,
		} = options ?? {};

		const payload: RoulettePlaceBetRequest = {
			type: RequestType.RPC,
			arg: {
				betOption: betOption,
				is_autobet: isAutobet,
				walletInfo: {
					amount: amount,
					unit: unit,
					displayCurrency: displayCurrency,
					wallet_type: walletType,
				},
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.ROULETTE_PLACE_BET,
			payload,
			headers,
		);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		betOption: string,
		options?: RoulettePlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() =>
			this.placeBet(amount, betOption, options),
		);
	}
}
