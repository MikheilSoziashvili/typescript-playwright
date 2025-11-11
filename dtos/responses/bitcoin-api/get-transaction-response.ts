import { UtxoRpcResponseBase } from "@core/interfaces";

export type GetTransactionResponse = UtxoRpcResponseBase & {
	result: {
		amount: number;
		fee?: number;
		confirmations: number;
		txid: string;
	};
};
