export interface PlinkoBetsAcrossMultipleWalletsCsvRecord {
	Wallet: string;
	BetCurrency: string;
	BetAmount: string;
}

export type PlinkoBetsAcrossMultipleWalletsCsv =
	PlinkoBetsAcrossMultipleWalletsCsvRecord[];
