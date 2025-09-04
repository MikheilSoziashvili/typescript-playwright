import { PlinkoTestDataCsvRecord } from "@dtos/csv/plinko-test-data-csv";

export interface PlinkoTestDataCsvParsedRecord {
	betAmount: number;
	rowsValue: number;
	riskValue: number;
}

export const parsePlinkoTestDataCsvRow = (
	row: PlinkoTestDataCsvRecord,
): PlinkoTestDataCsvParsedRecord => ({
	betAmount: +row.betAmount,
	rowsValue: +row.rowsValue,
	riskValue: +row.riskValue,
});
