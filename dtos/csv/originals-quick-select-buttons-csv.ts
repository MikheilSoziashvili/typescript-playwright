export interface OriginalsQuickSelectButtonsCsvRecord {
	buttonType: string;
	game: string;
	currency: string;
	initialBetAmount: string;
	minOrMaxAmount: string;
	expectedAfterFirstClick: string;
	expectedAfterSecondClick: string;
}

export type OriginalsQuickSelectButtonsCsv =
	OriginalsQuickSelectButtonsCsvRecord[];
