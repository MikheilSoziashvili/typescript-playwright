export interface JsonData {
	[key: string]: string | number | boolean | JsonData | JsonData[];
}

export interface RegisterTestDataParams {
	email?: string;
	username?: string;
	password?: string;
	useGamdomEmailDomain?: boolean;
}

export interface PromotionTestDataParams {
	title: string;
	customUrl: string;
	isForVip: string;
	promotionCategory: string;
	promotionSubCategory: string;
	coverImage?: string;
	thumbnailImage?: string;
	priority?: number;
	shortDescription?: string;
	detailedDescription?: string;
	termsAndConditions?: string;
	howToParticipate?: string;
	prizesDescription?: string;
	buttonText?: string;
	buttonLink?: string;
}

export interface WaitUntilOptions {
	errorMessage: string;
	intervalSeconds?: number;
	timeoutSeconds?: number;
}

export interface BitcoinRpcError {
	code: number;
	message: string;
}

export interface BitcoinRpcResponseBase {
	error: null | BitcoinRpcError;
	id: string;
}
