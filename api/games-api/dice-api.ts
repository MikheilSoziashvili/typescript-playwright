import { DicePlaceBetOptions } from "@core/api/interfaces/dice-place-bet-options";
import { PlaceBetRequest } from "@dtos/requests/games-api/dice-api/place-bet-request";
import { ApiEndpoints } from "@enums/api-endpoints";
import { Currency } from "@enums/currencies";
import { DiceRollType } from "@enums/dice-roll-type";
import { GameErrorMessage } from "@enums/game-error-messages";
import { OriginalGame } from "@enums/original-games";
import { RequestType } from "@enums/request-type";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { APIResponse } from "@playwright/test";
import { GamesBaseApi } from "./games-base-api";

export class DiceApi extends GamesBaseApi {
	constructor() {
		super({
			game: OriginalGame.Dice,
			errorMessage: GameErrorMessage.GAME_IN_PROGRESS,
			retryInterval: TimeoutSeconds.THREE,
			retryTimeout: TimeoutSeconds.SIXTY,
		});
	}

	public async placeBet(
		amount: number,
		rollOver: number,
		options?: DicePlaceBetOptions,
	): Promise<APIResponse> {
		const {
			rollType = DiceRollType.OVER,
			isAutobet = false,
			unit = Unit.COINS,
			displayCurrency = Currency.USD,
			walletType = WalletType.DEFAULT,
			headers,
		} = options ?? {};

		const payload: PlaceBetRequest = {
			type: RequestType.RPC,
			arg: {
				rollType: rollType,
				rollOver: rollOver,
				walletInfo: {
					amount: amount,
					unit: unit,
					displayCurrency: displayCurrency,
					wallet_type: walletType,
				},
				isAutobet: isAutobet,
			},
		};

		const parameters = this.buildParameters(
			ApiEndpoints.DICE_PLACE_BET,
			payload,
			headers,
		);

		return this.post(parameters);
	}

	public async placeBetUntilSuccessful(
		amount: number,
		rollOver: number,
		options?: DicePlaceBetOptions,
	): Promise<APIResponse> {
		return this.placeBetWithRetry(() =>
			this.placeBet(amount, rollOver, options),
		);
	}
}
