import { BooleanValueString } from "@enums/playwright/booleanValues";
import { PromotionInsertOptions } from "../interfaces/promotion-insert-options";

const basePromotionValues: Omit<PromotionInsertOptions, "title"> = {
	subtitle: "Default subtitle",
	description: "<h2>Default promotion</h2> This is a default promotion description.",
	termsAndConditions: "Default terms and conditions apply.",
	imageCover: "default_cover.jpg",
	imageThumbnail: "default_thumb.jpg",
	howToParticipate: "Default participation instructions.",
	rewardsInfo: "Default rewards information",
	priority: 12,
	isVisible: BooleanValueString.TRUE,
	buttonLink: "default-link",
	customUrl: null,
	category: "CASINO",
	subCategory: "CASINO",
	createdByAdminId: 1,
	updatedByAdminId: 1,
	startDate: null,
	expirationDate: null,
	created: null,
	modifiedDate: null,
	hasLogMessage: true,
};

function createPromotionDefaults(
	overrides: Partial<Omit<PromotionInsertOptions, "title">>
): Omit<PromotionInsertOptions, "title"> {
	return {
		...basePromotionValues,
		...overrides,
	};
}

export const DEFAULT_PROMOTION_VALUES = createPromotionDefaults({});

export const CASINO_PROMOTION_DEFAULTS = createPromotionDefaults({
	subtitle: "Casino exclusive offer",
	description: "<h2>Casino Promotion</h2> Enjoy exclusive casino bonuses and rewards.",
	termsAndConditions: "Casino terms and conditions apply. Wagering requirements may apply.",
	imageCover: "casino_promo_cover.jpg",
	imageThumbnail: "casino_promo_thumb.jpg",
	howToParticipate: "Visit the casino section and opt-in to participate.",
	rewardsInfo: "Casino bonus rewards",
	category: "CASINO",
	subCategory: "CASINO",
	priority: 3,
});

export const SPORTSBOOK_PROMOTION_DEFAULTS = createPromotionDefaults({
	subtitle: "Sports betting exclusive",
	description: "<h2>Sports Promotion</h2> Get enhanced odds and betting bonuses.",
	termsAndConditions: "Sportsbook terms apply. Minimum odds restrictions may apply.",
	imageCover: "sports_promo_cover.jpg",
	imageThumbnail: "sports_promo_thumb.jpg",
	howToParticipate: "Place qualifying bets in the sportsbook section.",
	rewardsInfo: "Enhanced odds and betting bonuses",
	category: "SPORTSBOOK",
	subCategory: "SPORTS",
	priority: 4,
});

export const LIVE_CASINO_PROMOTION_DEFAULTS = createPromotionDefaults({
	subtitle: "Live dealer exclusive",
	description: "<h2>Live Casino Promotion</h2> Experience real dealers with exclusive bonuses.",
	termsAndConditions: "Live casino terms apply. Valid on live dealer games only.",
	imageCover: "live_casino_cover.jpg",
	imageThumbnail: "live_casino_thumb.jpg",
	howToParticipate: "Join live dealer tables and opt-in for bonuses.",
	rewardsInfo: "Live dealer bonuses and cashback",
	category: "CASINO",
	subCategory: "LIVECASINO",
	priority: 5,
});

export const VIP_PROMOTION_DEFAULTS = createPromotionDefaults({
	subtitle: "VIP exclusive offer",
	description: "<h2>VIP Promotion</h2> Exclusive rewards for our VIP members.",
	termsAndConditions: "VIP terms apply. Available to VIP members only.",
	imageCover: "vip_promo_cover.jpg",
	imageThumbnail: "vip_promo_thumb.jpg",
	howToParticipate: "VIP members are automatically eligible.",
	rewardsInfo: "Exclusive VIP rewards and benefits",
	priority: 10,
	category: "CASINO",
	subCategory: "CASINO",
});
