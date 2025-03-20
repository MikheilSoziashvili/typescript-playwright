import { TransactionState } from "@enums/transaction-states";
import { TransactionType } from "@enums/transaction-types";

export type GetCryptoAdminTransactionsResponse = {
	id: number;
	created: string;
	changed: string;
	user_id: number;
	currency: string;
	address_id: number;
	txid: string;
	state: TransactionState;
	amount_crypto: string;
	amount_coins: number;
	crypto_price_usd: string;
	external_transaction_id?: string | null;
	chainalysis_id?: string | null;
	seon_id?: string | null;
	sweep_fee_coins?: number | null;
	sweep_fee_crypto?: string | null;
	refuel_fee_coins?: number | null;
	refuel_fee_crypto?: string | null;
	type: TransactionType;
	front_id: string;
};
