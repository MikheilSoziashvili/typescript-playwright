import { PromotionCombinationForLabelDisplayCsvRecord } from "@dtos/csv";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionLabels } from "@enums/promotion-labels";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";

export interface PromotionCombinationForLabelDisplayCsvParsedRecord {
	category: PromotionCategories;
	subcategory: PromotionSubStatuses;
	label: PromotionLabels;
	startDateMode: number;
	endDateMode: number;
}

export const parsePromotionCombinationLabelUpdateCsvRow = (
	row: PromotionCombinationForLabelDisplayCsvRecord,
): PromotionCombinationForLabelDisplayCsvParsedRecord => ({
	category: row.category as PromotionCategories,
	subcategory: row.subcategory as PromotionSubStatuses,
	label: row.label as PromotionLabels,
	startDateMode: Number(row.startDateMode),
	endDateMode: Number(row.endDateMode),
});
