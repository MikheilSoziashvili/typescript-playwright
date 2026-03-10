import { COINS_PER_USD } from "@core/handlers/user-balance-handler/user-balance-handler";
import { JackpotContributionCsvRecord } from "@dtos/csv/jackpot-contribution-csv";
import { OriginalGame } from "@enums/original-games";

export interface JackpotContributionCsvParsedRecord {
	game: OriginalGame;
	betAmountInCoins: number;
	expectedJackpotIncrease: number;
}

export const parseJackpotContributionCsvRow = (
	row: JackpotContributionCsvRecord,
): JackpotContributionCsvParsedRecord => ({
	game: row.Game as OriginalGame,
	betAmountInCoins: Number(row.BetAmount) * COINS_PER_USD,
	expectedJackpotIncrease: Number(row.JackpotIncreaseAmount),
});
