import { UtxoRpcResponseBase } from "@core/interfaces";

export type SendResponse = UtxoRpcResponseBase & {
	result: string;
};
