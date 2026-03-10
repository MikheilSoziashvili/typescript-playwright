import { ReloadUpdateAfterPartialClaimCsvRecord } from "@dtos/csv/reload-update-after-partial-claim-csv";
import { ToastTitle } from "@enums/toast-titles";

export interface ReloadUpdateAfterPartialClaimCsvParsedRecord {
	days: number;
	reloadCoins: number;
	dailyReward: number;
	dailyRewardAmount: string;
	updateRewardsDays: number;
	totalRewards: number;
	totalRewardsAmount: string;
	perClaimAmount: string;
	shouldToastBePresent: boolean;
	shouldRewardBePresent: boolean;
	shouldRewardBeClaimable: boolean;
	expectedToastType: ToastTitle;
	adminExpected: string;
	clientExpected: string;
}

export const parseReloadUpdateAfterPartialClaimCsvRow = (
	row: ReloadUpdateAfterPartialClaimCsvRecord,
): ReloadUpdateAfterPartialClaimCsvParsedRecord => ({
	days: +row.days,
	reloadCoins: +row.reloadCoins,
	dailyReward: +row.dailyReward,
	dailyRewardAmount: row.dailyRewardAmount,
	updateRewardsDays: +row.updateRewardsDays,
	totalRewards: +row.totalRewards,
	totalRewardsAmount: row.totalRewardsAmount,
	perClaimAmount: row.perClaimAmount,
	shouldToastBePresent: row.shouldToastBePresent === "true",
	shouldRewardBePresent: row.shouldRewardBePresent === "true",
	shouldRewardBeClaimable: row.shouldRewardBeClaimable === "true",
	expectedToastType: row.expectedToastType as ToastTitle,
	adminExpected: row.adminExpected,
	clientExpected: row.clientExpected,
});
