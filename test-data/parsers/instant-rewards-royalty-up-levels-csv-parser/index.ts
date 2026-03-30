import { InstantRewardsRoyaltyUpLevelsCsvRecord } from "@dtos/csv/instant-rewards-royalty-up-levels-csv";
import { OriginalGame } from "@enums/original-games";

export interface InstantRewardsRoyaltyUpLevelsCsvParsedRecord {
	level: string;
	game: OriginalGame;
	houseEdge: number;
	userBeXp: number;
}

export const parseInstantRewardsRoyaltyUpLevelsCsvRow = (
	row: InstantRewardsRoyaltyUpLevelsCsvRecord,
): InstantRewardsRoyaltyUpLevelsCsvParsedRecord => ({
	level: row.level,
	game: row.game,
	houseEdge: Number(row.houseEdge),
	userBeXp: Number(row.userBeXp),
});
