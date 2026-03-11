export interface ReloadUpdateLogicCsvRecord {
	days: string;
	dailyReward: string;
	totalReward: string;
	perClaimExpectedAmount: string;
	perClaimExpected: string;
	reloadCoins: string;
	updateNewTotal: string;
	expectedClaimedDays: string;
}

export type ReloadUpdateLogicCsv = ReloadUpdateLogicCsvRecord[];
