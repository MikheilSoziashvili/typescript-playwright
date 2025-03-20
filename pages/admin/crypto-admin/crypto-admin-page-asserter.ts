import { BaseAsserter } from "@pages/base/base-asserter";
import { CryptoAdminPage } from "./crypto-admin-page";
import { GamdomApi } from "@api/gamdom-api";
import { expect } from "playwright/test";
import { step } from "decorators/step";

export class CryptoAdminAsserter extends BaseAsserter<CryptoAdminPage> {
	public constructor(page: CryptoAdminPage) {
		super(page);
	}

	@step(`Assert the crypto amount value matching by transaction id`)
	public async assertTransactionCryptoAmount(
		gamdomApi: GamdomApi,
		adminCookie: string,
		transactionId: string,
		expectedAmount: number,
	): Promise<void> {
		const transactions = await gamdomApi.getCryptoAdminTransactions({
			Cookie: adminCookie,
		});

		const cryptoAmount = parseFloat(
			transactions.find((trx) => trx.txid.startsWith(transactionId))
				?.amount_crypto || "0",
		);

		expect(cryptoAmount).toEqual(expectedAmount);
	}
}
