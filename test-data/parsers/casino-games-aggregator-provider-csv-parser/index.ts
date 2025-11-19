import { CasinoGamesAggregatorProviderCsvRecord } from "@dtos/csv/casino-games-aggregator-provider-csv";
import { CasinoGameName, GameProvider } from "@enums/casino-game";

export interface CasinoGamesAggregatorProviderCsvParsedRecord {
	aggregator: string;
	gameProvider: GameProvider;
	gameName: CasinoGameName;
	gameCode: string;
}

export const parseCasinoGamesAggregatorProviderCsvRow = (
	row: CasinoGamesAggregatorProviderCsvRecord,
): CasinoGamesAggregatorProviderCsvParsedRecord => ({
	aggregator: row.aggregator,
	gameProvider: row.gameProvider as GameProvider,
	gameName: row.gameName as CasinoGameName,
	gameCode: row.gameCode,
});

