import { PromotionCombinationsNotForVipCsvRecord } from "@dtos/csv/promotion-combinations-not-for-vip-csv";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";

export interface PromotionCombinationsNotForVipCsvParsedRecord {
	category: PromotionCategories;
	subCategory: PromotionSubStatuses;
}

export const parsePromotionCombinationsNotForVipCsvRow = (
	row: PromotionCombinationsNotForVipCsvRecord,
): PromotionCombinationsNotForVipCsvParsedRecord => ({
	category:
		PromotionCategories[row.category as keyof typeof PromotionCategories],
	subCategory:
		PromotionSubStatuses[
			row.subCategory as keyof typeof PromotionSubStatuses
		],
});
