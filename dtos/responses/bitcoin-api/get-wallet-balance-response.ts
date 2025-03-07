import { BitcoinRpcResponseBase } from "@core/interfaces";

export type GetWalletBalanceResponse = BitcoinRpcResponseBase & {
	result: number;
};
