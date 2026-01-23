export interface EnableDisableCryptoCurrenciesStatusesCsvRecord {
	cryptoCurrency: string;
	cryptoTicker: string;
	isDepositEnabled: string;
	isWithdrawalEnabled: string;
}

export type EnableDisableCryptoCurrenciesStatusesCsv =
	EnableDisableCryptoCurrenciesStatusesCsvRecord[];
