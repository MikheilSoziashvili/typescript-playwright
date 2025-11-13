import { CasinoGameName, GameProvider } from "@enums/casino-game";

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
	promotionStartDate?: string;
	promotionEndDate?: string;
	promotionStartTime?: string;
	promotionEndTime?: string;
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

export interface UtxoRpcError {
	code: number;
	message: string;
}

export interface UtxoRpcResponseBase {
	error: null | UtxoRpcError;
	id: string;
}

export interface FaucetResponse {
	amount: number;
	balance: number;
}

export interface TransactionResult {
	txHash: string;
	validated: boolean;
}

export interface CasinoGameConfig {
	gameName: CasinoGameName;
	gameProvider: GameProvider;
}
