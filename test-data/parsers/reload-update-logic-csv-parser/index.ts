import { ReloadUpdateLogicCsvRecord } from "@dtos/csv/reload-update-logic-csv";

export interface ReloadUpdateLogicCsvParsedRecord {
	days: number;
	dailyReward: string;
	totalReward: string;
	perClaimExpectedAmount: string;
	perClaimExpected: number;
	reloadCoins: number;
	updateNewTotal: number;
	expectedClaimedDays: number;
}

export const parseReloadUpdateLogicCsvRow = (
	row: ReloadUpdateLogicCsvRecord,
): ReloadUpdateLogicCsvParsedRecord => ({
	days: +row.days,
	dailyReward: row.dailyReward,
	totalReward: row.totalReward,
	perClaimExpectedAmount: row.perClaimExpectedAmount,
	perClaimExpected: +row.perClaimExpected,
	reloadCoins: +row.reloadCoins,
	updateNewTotal: +row.updateNewTotal,
	expectedClaimedDays: +row.expectedClaimedDays,
});
