import { BaseAsserter } from "@pages/base/base-asserter";
import { CryptoAdminPage } from "./crypto-admin-page";
import { GamdomApi } from "@api/gamdom-api";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { HourlyCryptoBalancesResponse } from "@dtos/responses/gamdom-api/get-hourly-crypto-balances-response";
import { HourlyCryptoBalancesColumn } from "@enums/admin/hourly-crypto-balances-table-columns";
import { formatBalance, waitUntil } from "@core/utils/utils";
import { CurrencySymbol } from "@enums/currenciesSymbols";
import { NumberSeparators } from "@enums/number-separators";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { TransactionType } from "@enums/transaction-types";

export class CryptoAdminAsserter extends BaseAsserter<CryptoAdminPage> {
	public constructor(page: CryptoAdminPage) {
		super(page);
	}

	private readonly apiToHourlyCryptoBalancesTableColumnMap: Record<
		string,
		{
			col: HourlyCryptoBalancesColumn;
			format?: (val: string) => string | RegExp;
		}
	> = {
		currency: { col: HourlyCryptoBalancesColumn.CURRENCY },
		backend_title: { col: HourlyCryptoBalancesColumn.BACKEND_TITLE },
		amount_crypto: { col: HourlyCryptoBalancesColumn.AMOUNT_CRYPTO },
		crypto_price_usd: {
			col: HourlyCryptoBalancesColumn.PRICE_USD,
			format: (val: string) =>
				formatBalance(
					+val,
					CurrencySymbol.USD,
					2,
					NumberSeparators.THOUSAND,
					NumberSeparators.DECIMAL,
				),
		},
		amount_usd: {
			col: HourlyCryptoBalancesColumn.AMOUNT_USD,
			format: (val: string) =>
				formatBalance(
					+val,
					CurrencySymbol.USD,
					2,
					NumberSeparators.THOUSAND,
					NumberSeparators.DECIMAL,
				),
		},
		state: {
			col: HourlyCryptoBalancesColumn.STATE,
		},
		snapshot_time: { col: HourlyCryptoBalancesColumn.TIME },
	};

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

		const matched = transactions.find((trx) =>
			trx.txid.toLowerCase().startsWith(transactionId.toLowerCase()),
		);

		const cryptoAmount = parseFloat(matched?.amount_crypto ?? "0");

		expect(cryptoAmount).toBeCloseTo(expectedAmount, 5);
	}

	@step(`Assert the coins amount value matching by transaction id`)
	public async assertTransactionCoinsAmount(
		gamdomApi: GamdomApi,
		adminCookie: string,
		transactionId: string,
		expectedAmount: number,
		type?: TransactionType,
	): Promise<void> {
		const normalizedId = transactionId.toLowerCase();
		let coinsAmount: number | undefined;

		await waitUntil(
			async () => {
				const transactions = await gamdomApi.getCryptoAdminTransactions(
					{
						Cookie: adminCookie,
					},
				);

				const matched = transactions.find(
					(trx) =>
						(!type ||
							trx.type.toLowerCase() === type.toLowerCase()) &&
						typeof trx.txid === "string" &&
						trx.txid.toLowerCase().startsWith(normalizedId),
				);

				coinsAmount = matched?.amount_coins;
				return coinsAmount !== undefined;
			},
			{
				errorMessage: `Coins amount not found in transaction (txid startsWith '${transactionId}')`,
				intervalSeconds: TimeoutSeconds.FIVE,
				timeoutSeconds: TimeoutSeconds.THIRTY,
			},
		);

		if (coinsAmount === undefined) {
			throw new Error("Coins amount not found in transaction");
		}

		expect(Math.abs(coinsAmount - expectedAmount)).toBeLessThanOrEqual(20);
	}

	@step("Assert the 'Hourly Crypto Balances' table header is correct")
	public async hourlyCryptoBalancesTableHeaderVisibleCorrect(): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.hourlyCryptoBalancesHeader,
				expectedText: "Hourly Crypto Balances",
			},
		]);
	}

	@step("Assert the 'Hourly Crypto Balances' table is visible")
	public async hourlyCryptoBalancesTableVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.hourlyCryptoBalancesTable,
		]);
	}

	@step(
		"Assert all 'Hourly Crypto Balances' table column headers are visible",
	)
	public async hourlyCryptoBalancesTableColumnsVisibleCorrect(): Promise<void> {
		await this.checkElementsAreVisible(
			this.gamdomPage.map.hourlyCryptoBalancesTableColumnHeaders,
		);
	}

	@step(
		"Assert 'Hourly Crypto Balances' table header and column headers are correct",
	)
	public async hourlyCryptoBalancesTableHeaderColumnsCorrect(): Promise<void> {
		await this.hourlyCryptoBalancesTableHeaderVisibleCorrect();
		await this.hourlyCryptoBalancesTableColumnsVisibleCorrect();
	}

	@step("Assert 'Hourly Crypto Balances' table row cells correct")
	public async hourlyCryptoBalancesTableRowCellsCorrect(
		hourlyCryptoBalancesResponse: HourlyCryptoBalancesResponse,
	): Promise<void> {
		const rows = this.gamdomPage.map.hourlyCryptoBalancesTableRows;
		for (const [
			i,
			balance,
		] of hourlyCryptoBalancesResponse.balanceList.entries()) {
			for (const [apiKey, value] of Object.entries(balance)) {
				if (!(apiKey in this.apiToHourlyCryptoBalancesTableColumnMap)) {
					continue;
				}

				const { col, format } =
					this.apiToHourlyCryptoBalancesTableColumnMap[apiKey];
				const expected = format ? format(String(value)) : String(value);

				const cell =
					this.gamdomPage.map.hourlyCryptoBalancesTableRowCell(
						rows.nth(i),
						col,
					);

				await expect(
					cell,
					`Row: ${
						i + 1
					}, Col: ${col} cell value did not match expected value '${expected}'`,
				).toHaveText(expected);
			}
		}
	}
}
