import { OriginalGames } from "@core/types/types";
import { OriginalsSelfExclusionCsvRecord } from "@dtos/csv/originals-self-exclusion";
import { SelfExclusionDays } from "@enums/self-exlusion-days";

export interface OriginalsSelfExclusionCsvParsedRecord {
	period: SelfExclusionDays;
	game: OriginalGames;
}

export const parseOriginalsSelfExclusionCsvRow = (
	row: OriginalsSelfExclusionCsvRecord,
): OriginalsSelfExclusionCsvParsedRecord => ({
	period: row.period as SelfExclusionDays,
	game: row.game as OriginalGames,
});
