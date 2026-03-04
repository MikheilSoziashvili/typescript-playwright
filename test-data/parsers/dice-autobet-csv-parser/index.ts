import { DiceAutobetCsvRecord } from "@dtos/csv/dice-autobet-csv";

export interface DiceAutobetCsvParsedRecord {
	betAmount: number;
	rollOver: number;
	numberOfBets: number;
	stopOnProfit: number;
	stopOnLoss: number;
}

export const parseDiceAutobetCsvRow = (
	row: DiceAutobetCsvRecord,
): DiceAutobetCsvParsedRecord => ({
	betAmount: Number(row.betAmount),
	rollOver: Number(row.rollOver),
	numberOfBets: Number(row.numberOfBets),
	stopOnProfit: Number(row.stopOnProfit),
	stopOnLoss: Number(row.stopOnLoss),
});
