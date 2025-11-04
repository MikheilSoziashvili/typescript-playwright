import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { CryptoTicker } from "@enums/cryptocurrencies";

export class TransactionDetailsModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public depositAmountIn(cryptoCurrency: CryptoTicker): Locator {
		return this.page
			.locator("label", {
				hasText: `Deposit Amount in ${cryptoCurrency}`,
			})
			.locator("~ div input");
	}

	public get blockchainTransactionLink(): Locator {
		return this.page.locator('a:has-text("Blockchain Transaction")');
	}
}
