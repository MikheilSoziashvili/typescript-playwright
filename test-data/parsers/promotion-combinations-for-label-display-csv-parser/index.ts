import { PromotionCombinationForLabelDisplayV4CsvRecord } from "@dtos/csv";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionLabelsV4 } from "@enums/promotion-labels";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";

export interface PromotionCombinationForLabelDisplayV4CsvParsedRecord {
	category: PromotionCategories;
	subcategory: PromotionSubStatuses;
	label: PromotionLabelsV4;
	startDateMode: number;
	endDateMode: number;
}

export const parsePromotionCombinationLabelUpdateCsvRow = (
	row: PromotionCombinationForLabelDisplayV4CsvRecord,
): PromotionCombinationForLabelDisplayV4CsvParsedRecord => ({
	category: row.category as PromotionCategories,
	subcategory: row.subcategory as PromotionSubStatuses,
	label: row.label as PromotionLabelsV4,
	startDateMode: Number(row.startDateMode),
	endDateMode: Number(row.endDateMode),
});
