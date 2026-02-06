import { HourlyCryptoBalancesResponse } from "@dtos/responses/gamdom-api/get-hourly-crypto-balances-response";
import { ApiEndpoints } from "@enums/api-endpoints";
import { Timeout } from "@enums/timeout";
import type { Page } from "@playwright/test";
import { BaseNetworkListener } from "./base-listener";

export class HourlyCryptoBalancesListener extends BaseNetworkListener {
	constructor(page: Page) {
		super(page);
	}

	protected shouldCaptureResponse(url: string): boolean {
		return url.includes(ApiEndpoints.GET_HOURLY_CRYPTO_BALANCES);
	}

	public async getLastHourlyCryptoBalances(
		options = {
			intervalSeconds: Timeout.EXTRA_SHORT,
			timeoutSeconds: Timeout.LONG,
			errorMessage:
				"Timed out while waiting for hourly crypto balances response",
		},
	): Promise<HourlyCryptoBalancesResponse> {
		return this.waitForLastJson<HourlyCryptoBalancesResponse>(options);
	}
}
