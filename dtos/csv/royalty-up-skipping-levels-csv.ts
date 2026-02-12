import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";

export interface RoyaltyUpSkippingLevelsCsvRecord {
	currentLevel: RewardsRoyaltyUpRanks;
	requiredXpToUpgrade: string;
	newLevel: RewardsRoyaltyUpRanks;
	userBeXp: string;
	ranksRewards: string;
	claimableRewards: string;
	unclaimableRewards: string;
}

export type RoyaltyUpSkippingLevelsCsv = RoyaltyUpSkippingLevelsCsvRecord[];

