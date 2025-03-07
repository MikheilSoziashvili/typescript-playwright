import { BitcoinRpcResponseBase } from "@core/interfaces";

export type SendBTCResponse = BitcoinRpcResponseBase & {
	result: string;
};
