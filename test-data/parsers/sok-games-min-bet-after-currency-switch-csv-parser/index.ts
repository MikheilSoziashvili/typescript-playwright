import { SokGamesMinBetAfterCurrencySwitchCsvRecord } from "@dtos/csv/sok-games-min-bet-after-currency-switch-csv";
import { SokGame } from "@enums/sok-game";

export interface SokGamesMinBetAfterCurrencySwitchCsvParsedRecord {
	game: SokGame;
	minBetAmount: string;
}

export const parseSokGamesMinBetAfterCurrencySwitchCsvRow = (
	row: SokGamesMinBetAfterCurrencySwitchCsvRecord,
): SokGamesMinBetAfterCurrencySwitchCsvParsedRecord => ({
	game: row.game as SokGame,
	minBetAmount: row.minBetAmount,
});
