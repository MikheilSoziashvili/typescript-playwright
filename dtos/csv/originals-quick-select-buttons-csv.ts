export interface OriginalsQuickSelectButtonsCsvRecord {
	buttonType: string;
	game: string;
	initialBetAmount: string;
	expectedAfterFirstClick: string;
	expectedAfterSecondClick: string;
}

export type OriginalsQuickSelectButtonsCsv =
	OriginalsQuickSelectButtonsCsvRecord[];
