import { BitcoinRpcResponseBase } from "@core/interfaces";

export type GetTransactionResponse = BitcoinRpcResponseBase & {
	result: {
		amount: number;
		fee?: number;
		confirmations: number;
		txid: string;
	};
};
