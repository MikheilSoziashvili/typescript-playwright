export interface CrashIncreaseBysCsvRecord {
	increase_by: string;
	your_bet: string;
	auto_cashout: string;
	increase_multiplier: string;
	stop_if_more_than: string;
}

export type CrashIncreaseBysCsv = CrashIncreaseBysCsvRecord[];
