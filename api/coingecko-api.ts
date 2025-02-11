import { BaseApi } from "./base-api";
import * as Configuration from "../configuration";
import { SIMPLE_PRICE_ENDPOINT } from "@constants/coingecko-endpoints";
import { SimplePriceResponseDto } from "@dtos/responses/coingecko-api/simple-price-response";
import { CoinId } from "@enums/coingecko-crypto-ids";
import { Currency } from "@enums/currencies";

export class CoinGeckoApi extends BaseApi {
	constructor(
		coingeckoConfig: Record<string, string> = Configuration.coingecko,
	) {
		super(coingeckoConfig.baseUrl);
		this.setHeaders({
			"x-cg-demo-api-key": coingeckoConfig.apiKey,
		});
	}

	public async getCoinPrice(
		coinIds: CoinId[],
		currency: Currency,
	): Promise<SimplePriceResponseDto> {
		const response = await this.get({
			endpoint: SIMPLE_PRICE_ENDPOINT,
			queryParams: {
				ids: coinIds.join(","),
				vs_currencies: currency,
			},
		});

		return (await response.json()) as SimplePriceResponseDto;
	}
}
