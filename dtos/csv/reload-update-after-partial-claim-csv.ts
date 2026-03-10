export interface ReloadUpdateAfterPartialClaimCsvRecord {
	days: string;
	reloadCoins: string;
	dailyReward: string;
	dailyRewardAmount: string;
	updateRewardsDays: string;
	totalRewards: string;
	totalRewardsAmount: string;
	perClaimAmount: string;
	shouldToastBePresent: string;
	shouldRewardBePresent: string;
	shouldRewardBeClaimable: string;
	expectedToastType: string;
	adminExpected: string;
	clientExpected: string;
}

export type ReloadUpdateAfterPartialClaimCsv =
	ReloadUpdateAfterPartialClaimCsvRecord[];
