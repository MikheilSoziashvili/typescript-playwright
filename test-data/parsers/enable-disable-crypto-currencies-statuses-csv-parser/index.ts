import { EnableDisableCryptoCurrenciesStatusesCsvRecord } from "@dtos/csv/enable-disable-crypto-currencies-statuses-csv";
import { Cryptocurrency, CryptoTicker } from "@enums/cryptocurrencies";

export interface EnableDisableCryptoCurrenciesStatusesCsvParsedRecord {
	cryptoCurrencies: (Cryptocurrency | CryptoTicker)[];
	cryptoTicker: Cryptocurrency | CryptoTicker;
	isDepositEnabled: boolean;
	isWithdrawalEnabled: boolean;
}

export const parseEnableDisableCryptoCurrenciesStatusesCsvRow = (
	row: EnableDisableCryptoCurrenciesStatusesCsvRecord,
): EnableDisableCryptoCurrenciesStatusesCsvParsedRecord => ({
	cryptoCurrencies: row.cryptoCurrency
		.split("|")
		.map((crypto) => crypto.trim() as Cryptocurrency | CryptoTicker),
	cryptoTicker: row.cryptoTicker as Cryptocurrency | CryptoTicker,
	isDepositEnabled: row.isDepositEnabled === "true",
	isWithdrawalEnabled: row.isWithdrawalEnabled === "true",
});
