import { RoyaltyUpLevelRanksCsvRecord } from "@dtos/csv";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";

export interface RoyaltyUpLevelRanksCsvParsedRecord {
	currentLevel: RewardsRoyaltyUpRanks;
	requiredXpToUpgrade: string;
	newLevel: RewardsRoyaltyUpRanks;
	rewardAmount: string;
	userBeXp: number;
	rankXp: number;
}

export const parseRoyaltyUpLevelRanksCsvRow = (
	row: RoyaltyUpLevelRanksCsvRecord,
): RoyaltyUpLevelRanksCsvParsedRecord => ({
	currentLevel: row.currentLevel,
	requiredXpToUpgrade: row.requiredXpToUpgrade,
	newLevel: row.newLevel,
	rewardAmount: row.rewardAmount,
	userBeXp: Number(row.userBeXp),
	rankXp: Number(row.rankXp),
});
