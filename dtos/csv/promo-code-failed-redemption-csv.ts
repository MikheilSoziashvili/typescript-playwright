import { PromoCodeStatusValue } from "@enums/db/campaign-promo-status-value";
import { CampaignPromoType } from "@enums/db/campaign-promo-type";

export interface PromoCodeFailedRedemptionCsvRecord {
	promo_code_type: CampaignPromoType;
	promo_code_status: PromoCodeStatusValue;
	error: string;
}

export type PromoCodeFailedRedemptionCsv = PromoCodeFailedRedemptionCsvRecord[];
