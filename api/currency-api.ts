import { Currency } from "@enums/currencies";
import * as Configuration from "../configuration";
import { BaseApi } from "./base-api";
import { WalletUnit } from "@core/types/types";
import { GetCurrencyRequest } from "@dtos/requests/currency-api/get-currency-request";
import { ApiEndpoints } from "@enums/api-endpoints";
import { GetCurrencyResponse } from "@dtos/responses/currency-api/get-currency-response";
import { GetWalletsResponse } from "@dtos/responses/currency-api/get-wallets-response";
import { Page } from "@playwright/test";

export class CurrencyApi extends BaseApi {
	private readonly _page: Page | undefined;
	constructor(base_url: string = Configuration.environment_url, page?: Page) {
		super(base_url);
		this._page = page;
		this.setHeaders({
			Authorization: `Bearer ${process.env.OAUTH2_JWT}`,
		});
	}

	/**
	 * Captures the current storage state (cookies, localStorage, sessionStorage)
	 * from the associated Playwright {@link Page} and applies it to the API request context.
	 *
	 * This allows subsequent API calls to share the same authenticated session
	 * and browser state as the page. Useful after performing login steps in the UI
	 * and wanting to reuse that state in API requests.
	 *
	 * @returns A promise that resolves when the storage state has been captured
	 * and applied to the API context.
	 */
	public async sharePageStorageState(): Promise<void> {
		if (this._page !== undefined) {
			const storageState = await this._page.context().storageState();
			await this.addContextStorageState(storageState);
		}
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
