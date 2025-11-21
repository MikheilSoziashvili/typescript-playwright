import { GamdomApi } from "@api/gamdom-api";
import { waitUntil } from "@core/utils/utils";
import { HourlyCryptoBalancesResponse } from "@dtos/responses/gamdom-api/get-hourly-crypto-balances-response";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";
import { hourlyCryptoBalancesCronInterval } from "configuration";

export class GamdomApiFacade {
	private gamdomApi: GamdomApi;

	constructor() {
		this.gamdomApi = new GamdomApi();
	}

	public async waitUntilHourlyCryptoBalancesDataUpdated(
		latestHourlyCryptoBalances: HourlyCryptoBalancesResponse,
		headers?: Record<string, string>,
		waitTimeout = hourlyCryptoBalancesCronInterval,
	): Promise<HourlyCryptoBalancesResponse> {
		const latestDates = new Set(
			latestHourlyCryptoBalances.balanceList.map((balance) =>
				new Date(balance.snapshot_time).getTime(),
			),
		);

		logger.info(
			`[HourlyBalances] Waiting for new hourly crypto balance data. ` +
				`Initial snapshot timestamps count: ${latestDates.size}`,
		);

		await waitUntil(
			async () => {
				logger.info(
					`[HourlyBalances] Checking for updated hourly crypto balances...`,
				);
				const response = await this.gamdomApi.getHourlyCryptoBalances({
					headers,
				});

				const newList = response.balanceList;

				if (newList.length === 0) {
					logger.info(
						`[HourlyBalances] API returned an empty balance list - continuing to wait.`,
					);

					return false;
				}

				const hasNewTimestamp = newList.some((balance) => {
					const ts = new Date(balance.snapshot_time).getTime();
					return !latestDates.has(ts);
				});

				if (hasNewTimestamp) {
					logger.info(
						`[HourlyBalances] New timestamp detected! The cron job has updated the data.`,
					);
				} else {
					logger.info(
						`[HourlyBalances] No new timestamps yet — still waiting. ` +
							`Latest returned timestamp: ${newList[0].snapshot_time}`,
					);
				}

				return hasNewTimestamp;
			},
			{
				errorMessage: `Hourly crypto balances were not updated within ${waitTimeout} seconds`,
				intervalSeconds: TimeoutSeconds.FIVE,
				timeoutSeconds: waitTimeout,
			},
		);

		logger.info(
			`[HourlyBalances] Update detected. Fetching final updated balances...`,
		);

		const balances = await this.gamdomApi.getHourlyCryptoBalances({
			headers,
		});

		logger.info(
			`[HourlyBalances] Final updated list retrieved. Count: ${balances.balanceList.length}`,
		);

		return balances;
	}
}
