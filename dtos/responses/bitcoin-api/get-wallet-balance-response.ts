import { UtxoRpcResponseBase } from "@core/interfaces";

export type GetWalletBalanceResponse = UtxoRpcResponseBase & {
	result: number;
};
