export interface PromotionCombinationForLabelDisplayV4CsvRecord {
	category: string;
	subcategory: string;
	label: string;
	startDateMode: number;
	endDateMode: number;
}

export type PromotionCombinationForLabelDisplayV4Csv =
	PromotionCombinationForLabelDisplayV4CsvRecord[];
