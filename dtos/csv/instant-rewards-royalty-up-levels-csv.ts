import { OriginalGame } from "@enums/original-games";

export interface InstantRewardsRoyaltyUpLevelsCsvRecord {
	level: string;
	game: OriginalGame;
	houseEdge: string;
	userBeXp: string;
}

export type InstantRewardsRoyaltyUpLevelsCsv =
	InstantRewardsRoyaltyUpLevelsCsvRecord[];
