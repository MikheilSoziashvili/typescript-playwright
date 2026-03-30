export type RankRewardConfig = {
	instantRakebackPercentage: number;
	royaltyUpRewardCoins: number;
};

export type ChangeRankRewardConfigsRequest = {
	rankIdToRewardConfigs: Record<string, RankRewardConfig>;
};
