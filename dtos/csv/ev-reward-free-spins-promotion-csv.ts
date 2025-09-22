export interface EvRewardFreeSpinsPromotionCsvRecord {
	iterationName: string;
	startDate: string;
	endDate: string;
	fileKey: string;
	expectedResult: string;
	expectedLogs: string;
}

export type EvRewardFreeSpinsPromotionCsv =
	EvRewardFreeSpinsPromotionCsvRecord[];
