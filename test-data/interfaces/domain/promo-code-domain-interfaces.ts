import { PromotionType } from "@enums/promotion-types";
import { PromotionStatuses } from "@enums/promotion-statuses";

export interface PromoCodeScenario {
	promoType: PromotionType;
	status: PromotionStatuses;
	description: string;
}
