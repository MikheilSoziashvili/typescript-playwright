import type { Page } from "@playwright/test";
import { BaseNetworkListener } from "./base-listener";
import { ApiEndpoints } from "@enums/api-endpoints";
import { HourlyCryptoBalancesResponse } from "@dtos/responses/gamdom-api/get-hourly-crypto-balances-response";
import { waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";

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
		let latestPayload: HourlyCryptoBalancesResponse | undefined;

		await waitUntil(
			async () => {
				if (this.responses.length === 0) {
					return false;
				}

				const payloads = await Promise.all(
					this.responses.map(
						(r) =>
							r.json() as Promise<HourlyCryptoBalancesResponse>,
					),
				);

				latestPayload = payloads.at(-1) ?? undefined;

				return latestPayload !== undefined;
			},
			{
				errorMessage: options.errorMessage,
				intervalSeconds: options.intervalSeconds,
				timeoutSeconds: options.timeoutSeconds,
			},
		);

		if (!latestPayload) {
			throw new Error(
				"Unexpected: no latestPayload after waitUntil succeeded",
			);
		}

		return latestPayload;
	}
}
