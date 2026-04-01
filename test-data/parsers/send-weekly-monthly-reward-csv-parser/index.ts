import { SendWeeklyMonthlyRewardCsvRecord } from "@dtos/csv/send-weekly-monthly-reward-csv";
import { RewardType } from "@enums/admin/reward-type";

export interface SendWeeklyMonthlyRewardCsvParsedRecord {
	rewardType: RewardType.WEEKLY | RewardType.MONTHLY;
}

export const parseSendWeeklyMonthlyRewardCsvRow = (
	row: SendWeeklyMonthlyRewardCsvRecord,
): SendWeeklyMonthlyRewardCsvParsedRecord => ({
	rewardType: row.rewardType as RewardType.WEEKLY | RewardType.MONTHLY,
});
