import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";

export interface RoyaltyUpLevelRanksTestDataParams {
	currentLevel: RewardsRoyaltyUpRanks;
	requiredXpToUpgrade?: string;
	newLevel: RewardsRoyaltyUpRanks;
	rewardAmount?: string;
	userBeXp?: number;
	rankXp?: number;
}

export class RoyaltyUpLevelRanksTestData {
	public currentLevel: RewardsRoyaltyUpRanks;
	public requiredXpToUpgrade: string;
	public newLevel: RewardsRoyaltyUpRanks;
	public rewardAmount: string;
	public userBeXp: number;
	public rankXp: number;

	constructor(params: RoyaltyUpLevelRanksTestDataParams) {
		this.currentLevel = params.currentLevel;
		this.requiredXpToUpgrade = params.requiredXpToUpgrade ?? "0";
		this.newLevel = params.newLevel;
		this.rewardAmount = params.rewardAmount ?? "$0.00";
		this.userBeXp = params.userBeXp ?? 0;
		this.rankXp = params.rankXp ?? 0;
	}
}

