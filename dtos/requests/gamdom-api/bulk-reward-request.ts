export type BulkRewardRequest = {
	rewardType: string;
	rewards: {
		userId: number;
		rewardCoins: number;
	}[];
	periodIdentifier: string;
	overrideKey: string | null;
	startDate: string | null;
};
