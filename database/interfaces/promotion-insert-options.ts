import { NullableDateString, NullableString } from "@core/types/types";
import { BooleanValueString } from "@enums/playwright/booleanValues";

export interface PromotionInsertOptions {
	title: string;
	subtitle?: NullableString;
	description?: NullableString;
	termsAndConditions?: NullableString;
	imageCover?: NullableString;
	imageThumbnail?: NullableString;
	howToParticipate?: NullableString;
	rewardsInfo?: NullableString;
	priority?: number;
	isVisible?: BooleanValueString;
	buttonLink?: NullableString;
	buttonText?: NullableString;
	customUrl?: NullableString;
	category?: NullableString;
	subCategory?: NullableString;
	createdByAdminId?: number;
	updatedByAdminId?: number;
	startDate?: NullableDateString;
	expirationDate?: NullableDateString;
	created?: NullableDateString;
	modifiedDate?: NullableDateString;
	hasLogMessage?: boolean;
}
