import { buildCasinoGamesSearchEndpoint } from "@core/helpers/endpoint-builder";
import { CasinoGamesSearchResponse } from "@dtos/responses/gamdom-api/get-casino-games-search-response";
import { CasinoGameCodeEntry } from "@enums/casino-game-code";
import { Timeout } from "@enums/timeout";
import { Page } from "@playwright/test";
import { BaseNetworkListener } from "./base-listener";

export class CasinoGamesSearchListener extends BaseNetworkListener {
	constructor(page: Page) {
		super(page);
	}

	protected shouldCaptureResponse(url: string): boolean {
		return url.includes(buildCasinoGamesSearchEndpoint());
	}

	public async getLastCasinoGamesSearch(
		options = {
			intervalSeconds: Timeout.EXTRA_SHORT,
			timeoutSeconds: Timeout.LONG,
			errorMessage:
				"Timed out while waiting for casino games-search response",
		},
	): Promise<CasinoGamesSearchResponse> {
		return this.waitForLastJson<CasinoGamesSearchResponse>(options);
	}

	public getGameIndexByCode(
		payload: CasinoGamesSearchResponse,
		gameCode: string,
	): number {
		const normalizedGameCode = gameCode.trim().toLowerCase();

		const gameIndex = payload.games.findIndex(
			(game) =>
				game.staticData.game_code.trim().toLowerCase() ===
				normalizedGameCode,
		);

		if (gameIndex === -1) {
			const availableCodes = payload.games
				.map((g) => g.staticData.game_code)
				.join(", ");
			throw new Error(
				`Game code "${gameCode}" not found in casino games-search response. Available codes: ${availableCodes}`,
			);
		}

		return gameIndex;
	}

	public getGameIndex(
		payload: CasinoGamesSearchResponse,
		game: CasinoGameCodeEntry,
	): number {
		const gameIndex = this.getGameIndexByCode(payload, game.code);

		if (gameIndex === -1) {
			const available = payload.games
				.map((g) => `${g.staticData.name} (${g.staticData.game_code})`)
				.join(", ");
			throw new Error(
				`Game "${game.name}" (${game.code}) not found in casino games-search response. Available games: ${available}`,
			);
		}

		return gameIndex;
	}
}
