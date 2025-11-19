export interface CasinoGamesAggregatorProviderCsvRecord {
	aggregator: string;
	gameProvider: string;
	gameName: string;
	gameCode: string;
}

export type CasinoGamesAggregatorProviderCsv =
	CasinoGamesAggregatorProviderCsvRecord[];

