import { PlinkoBetsAcrossMultipleWalletsCsvRecord } from "@dtos/csv/plinko-bets-across-multiple-wallets-csv";

export interface PlinkoBetsAcrossMultipleWalletsCsvParsedRecord {
	Wallet: string;
	BetCurrency: string;
	BetAmount: number;
}

export const parsePlinkoBetsAcrossMultipleWalletsCsvRow = (
	row: PlinkoBetsAcrossMultipleWalletsCsvRecord,
): PlinkoBetsAcrossMultipleWalletsCsvParsedRecord => ({
	Wallet: row.Wallet,
	BetCurrency: row.BetCurrency,
	BetAmount: +row.BetAmount,
});
