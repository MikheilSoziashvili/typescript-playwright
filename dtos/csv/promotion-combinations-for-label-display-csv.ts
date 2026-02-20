export interface PromotionCombinationForLabelDisplayCsvRecord {
	category: string;
	subcategory: string;
	label: string;
	startDateMode: number;
	endDateMode: number;
}

export type PromotionCombinationForLabelDisplayCsv =
	PromotionCombinationForLabelDisplayCsvRecord[];
