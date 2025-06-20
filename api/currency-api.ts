import { Currency } from "@enums/currencies";
import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";
import { WalletUnit } from "@core/types/types";
import { GetCurrencyRequest } from "@dtos/requests/currency-api/get-currency-request";
import { ApiEndpoints } from "@enums/api-endpoints";
import { GetCurrencyResponse } from "@dtos/responses/currency-api/get-currency-response";
import { GetWalletsResponse } from "@dtos/responses/currency-api/get-wallets-response";

export class CurrencyApi extends BaseApi {
	constructor(base_url: string = Configuration.environment_url) {
		super(base_url);
		this.setHeaders({
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		});
	}

	public async getCurrency(
		displayCurrency: Currency,
		walletUnit: WalletUnit,
		_headers?: Record<string, string>,
	): Promise<GetCurrencyResponse[]> {
		const payload: GetCurrencyRequest = {
			displayCurrency,
			walletUnit,
		};

		const parameters = this.buildParameters(
			ApiEndpoints.GET_CURRENCY,
			payload,
			_headers,
		);

		const response = await this.post(parameters);
		return response.json() as Promise<GetCurrencyResponse[]>;
	}

	public async getWallets(
		_headers?: Record<string, string>,
	): Promise<GetWalletsResponse> {
		const parameters = this.buildParameters(
			ApiEndpoints.GET_WALLETS,
			undefined,
			_headers,
		);

		const response = await this.post(parameters);
		return response.json() as Promise<GetWalletsResponse>;
	}
}
