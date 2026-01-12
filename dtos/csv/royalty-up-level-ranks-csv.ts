import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";

export interface RoyaltyUpLevelRanksCsvRecord {
	currentLevel: RewardsRoyaltyUpRanks;
	requiredXpToUpgrade: string;
	newLevel: RewardsRoyaltyUpRanks;
	rewardAmount: string;
	userBeXp: number;
	rankXp: number;
}

export type RoyaltyUpLevelRanksCsv = RoyaltyUpLevelRanksCsvRecord[];
