import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { ApiEndpoints } from "@enums/api-endpoints";
import { SetHotWalletE2EConfigRequest } from "@dtos/requests/gamdom-crypto-api/set-hot-wallet-e2e-config-request";
import { HotWalletConfigResponse } from "@dtos/responses/gamdom-crypto-api/hot-wallet-config-response";
import { logger } from "@logger/logger";

export class GamdomCryptoApi extends BaseApi {
	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
		this.setHeaders({
			"e2e-hot-wallet-config-admin-api-key":
				Configuration.hotWalletConfig.adminApiKey,
		});
	}

	public async setHotWalletE2EConfig(
		payload: SetHotWalletE2EConfigRequest,
		_headers?: Record<string, string>,
	): Promise<HotWalletConfigResponse> {
		logger.info("Setting hot wallet E2E config", payload);

		const parameters = this.buildParameters(
			ApiEndpoints.SET_E2E_HOT_WALLET_CONFIG,
			payload,
			_headers,
		);

		const response = await this.post(parameters);
		const responseBody = (await response.json()) as HotWalletConfigResponse;

		if (responseBody.ok !== true) {
			throw new Error(
				`${ApiEndpoints.SET_E2E_HOT_WALLET_CONFIG} responded without { ok: true }. ` +
					`Body: ${JSON.stringify(responseBody)}`,
			);
		}

		logger.info("Hot wallet E2E config updated successfully", responseBody);

		return responseBody;
	}

	public async resetHotWalletE2EConfig(): Promise<HotWalletConfigResponse> {
		return this.setHotWalletE2EConfig({
			isLowWalletBalanceAlertTest: false,
			lowWalletBalanceNotificationIntervalMin: 0,
			monitorHotWalletBalanceIntervalMin: 0,
		});
	}
}
