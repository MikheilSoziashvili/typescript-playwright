import { NullableDateString, NullableString } from "@core/types/types";
import { CampaignPromoType } from "@enums/db/campaign-promo-type";
import { CampaignRuleType } from "@enums/db/campaign-rule-type";

export interface PromoCampaignInsertOptions {
	name: string;
	status?: NullableString;
	promoCode: string;
	promoType: CampaignPromoType;
	rewardAmount?: number;
	rewardCurrency?: NullableString;
	startDate?: NullableDateString;
	expirationDate?: NullableDateString;
	created?: NullableDateString;
	modifiedDate?: NullableDateString;
}

export interface PromoCampaignRedemptionInsertOptions {
	userId: number;
	campaignId: number;
	redeemedAt?: NullableDateString;
	created?: NullableDateString;
}

export interface PromoCampaignRuleInsertOptions {
	campaignId: number;
	ruleType: CampaignRuleType | string;
	ruleData: Record<string, unknown>;
	created?: NullableDateString;
	modifiedDate?: NullableDateString;
}
