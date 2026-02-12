import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";

/**
 * Bronze tier edge ranks (leftmost ranks in the slider)
 * These ranks require special navigation handling due to their position
 */
export const BRONZE_EDGE_RANKS: RewardsRoyaltyUpRanks[] = [
	RewardsRoyaltyUpRanks.BRONZE_1,
	RewardsRoyaltyUpRanks.BRONZE_2,
	RewardsRoyaltyUpRanks.BRONZE_3,
] as const;

/**
 * Opal tier edge ranks (rightmost ranks in the slider)
 * These ranks require special navigation handling due to their position
 */
export const OPAL_EDGE_RANKS: RewardsRoyaltyUpRanks[] = [
	RewardsRoyaltyUpRanks.OPAL_1,
	RewardsRoyaltyUpRanks.OPAL_2,
	RewardsRoyaltyUpRanks.OPAL_3,
] as const;

/**
 * All claimable royalty up ranks (excludes UNRANKED)
 * Used for navigation and rank ordering
 */
export const CLAIMABLE_ROYALTY_UP_RANKS: RewardsRoyaltyUpRanks[] =
	Object.values(RewardsRoyaltyUpRanks).filter(
		(rank) => rank !== RewardsRoyaltyUpRanks.UNRANKED,
	) as RewardsRoyaltyUpRanks[];

