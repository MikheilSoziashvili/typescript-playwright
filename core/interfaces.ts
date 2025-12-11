import { BaccaratBetSpot } from "@enums/baccarat-game-options";
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

export interface PlayUntilWonOptions {
	betSpots: BaccaratBetSpot | BaccaratBetSpot[];
	betAmount: number;
	maxAttempts?: number;
}

export interface GameRoundResult {
	won: boolean;
	amount: string;
	betSpot: BaccaratBetSpot;
}

export interface AddressBalanceResponse {
	chain_stats: {
		funded_txo_sum: number;
		spent_txo_sum: number;
	};
	mempool_stats: {
		funded_txo_sum: number;
		spent_txo_sum: number;
	};
}

export interface ElectrsUtxo {
	txid: string;
	vout: number;
	status: {
		confirmed: boolean;
		block_height?: number;
	};
	value: number;
}

export interface ElectrsTxResponse {
	txid: string;
	status: {
		confirmed: boolean;
		block_height?: number;
	};
}

export interface TransactionResult {
	txHash: string;
	validated: boolean;
}

export interface SportsBlogArticleTestDataParams {
	title: string;
	customUrl: string;
	subtitle: string;
	detailedDescription?: string;
	author: string;
	articleStartDate?: string;
	articleStartTime?: string;
	coverImage?: string;
	thumbnailImage?: string;
}

export interface PromotionTestDataParamsV4 {
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

export interface TransactionDetails {
	id?: number;
	user_id?: number;
	log_type?: string;
	delta?: number;
	delta_in_unit?: number;
	balance_after?: number;
	wallet_unit?: string;
	crypto_rate?: string;
	log_type_detail?: string;
	source_table?: string;
	source_id?: string;
	full_row?: {
		id?: number;
		created?: string;
		changed?: string;
		address?: string;
		txid?: string;
		amount_crypto?: number;
		crypto_price_usd?: number;
		paid_fee_coins?: number;
		external_transaction_id?: string;
		destination_tag?: string | null;
		chainalysis_id?: string | null;
		backend_type?: string;
		backend_title?: string;
		scan_id?: string | null;
		meta?: string | null;
		modified?: string | null;
		nonce?: string | null;
	};
	amount_crypto?: number;
	crypto_price_usd?: number;
	paid_fee_coins?: number;
	external_transaction_id?: string;
	destination_tag?: string | null;
	chainalysis_id?: string | null;
	backend_type?: string;
	backend_title?: string;
	scan_id?: string | null;
	meta?: string | null;
	modified?: string | null;
	nonce?: string | null;
	fee_level?: string;
	user_paid_fee_coins?: number;
	paid_fee_delta_coins?: number;
	bulk_withdrawal_id?: number | null;
	[key: string]: unknown;
}
