import { CrashAutoCashoutCsvRecord } from "@dtos/csv/crash-auto-cashout-csv";

export interface CrashAutoCashoutCsvParsedRecord {
	yourBet: number;
	autoCashout: number;
	expectedResults: number;
}

export const parseCrashAutoCashoutCsvRow = (
	row: CrashAutoCashoutCsvRecord,
): CrashAutoCashoutCsvParsedRecord => ({
	yourBet: Number(row.your_bet),
	autoCashout: Number(row.auto_cashout),
	expectedResults: Number(row.expected_results),
});
