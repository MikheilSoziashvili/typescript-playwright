import { HiloPlaceBetOptions } from "@core/api/interfaces/hilo-place-bet-options";
import { HiloPlaceBetRequest } from "@dtos/requests/games-api/hilo-api/place-bet-request";
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

export class HiloApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.HiLo,
			errorMessage: GameErrorMessage.BET_AFTER_START,
			retryInterval: TimeoutSeconds.TWO,
			retryTimeout: TimeoutSeconds.THIRTY,
		});
	}

	public async placeBet(
		amount: number,
		betOption: string,
		options?: HiloPlaceBetOptions,
	): Promise<APIResponse> {
		const {
			isAutobet = false,
			unit = Unit.COINS,
			displayCurrency = Currency.USD,
			walletType = WalletType.DEFAULT,
			headers,
		} = options ?? {};

		const payload: HiloPlaceBetRequest = {
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
			ApiEndpoints.HILO_PLACE_BET,
			payload,
			headers,
		);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		betOption: string,
		options?: HiloPlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() =>
			this.placeBet(amount, betOption, options),
		);
	}
}
