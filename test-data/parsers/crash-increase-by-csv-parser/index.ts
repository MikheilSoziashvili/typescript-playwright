import { CrashIncreaseBysCsvRecord } from "@dtos/csv/crash-increase-by-csv";
import { BetIncreaseCondition } from "@enums/crash-autobet-section";

export interface CrashIncreaseBysCsvParsedRecord {
	increaseBy: BetIncreaseCondition | string;
	yourBet: number;
	autoCashout: number;
	increaseMultiplier: number;
	stopIfMoreThan: number;
}

export const parseCrashIncreaseBysCsvRow = (
	row: CrashIncreaseBysCsvRecord,
): CrashIncreaseBysCsvParsedRecord => ({
	increaseBy: row.increase_by,
	yourBet: Number(row.your_bet),
	autoCashout: Number(row.auto_cashout),
	increaseMultiplier: Number(row.increase_multiplier),
	stopIfMoreThan: Number(row.stop_if_more_than),
});
