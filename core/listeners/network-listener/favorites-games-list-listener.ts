import { buildCasinoGamesListEndpoint } from "@core/helpers/endpoint-builder";
import { FavoritesGamesListResponse } from "@dtos/responses/gamdom-api/get-favorites-games-list-response";
import { Timeout } from "@enums/timeout";
import { Page } from "@playwright/test";
import { BaseNetworkListener } from "./base-listener";

export class FavoritesGamesListListener extends BaseNetworkListener {
	constructor(page: Page) {
		super(page);
	}

	protected shouldCaptureResponse(url: string): boolean {
		return url.includes(buildCasinoGamesListEndpoint());
	}

	public async getLastFavoritesGamesList(
		options = {
			intervalSeconds: Timeout.EXTRA_SHORT,
			timeoutSeconds: Timeout.LONG,
			errorMessage:
				"Timed out while waiting for favorites games-list response",
		},
	): Promise<FavoritesGamesListResponse> {
		return this.waitForLastJson<FavoritesGamesListResponse>(options);
	}
}
