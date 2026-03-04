export interface DiceAutobetCsvRecord {
	betAmount: string;
	rollOver: string;
	numberOfBets: string;
	stopOnProfit: string;
	stopOnLoss: string;
}

export type DiceAutobetCsv = DiceAutobetCsvRecord[];
