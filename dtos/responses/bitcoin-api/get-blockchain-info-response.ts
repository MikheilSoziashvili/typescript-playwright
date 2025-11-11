import { UtxoRpcResponseBase } from "@core/interfaces";

export type GetBlockchainInfoResponse = UtxoRpcResponseBase & {
	result: {
		chain: string;
		blocks: number;
		headers: number;
		bestblockhash: string;
		difficulty: number;
		mediantime: number;
		verificationprogress: number;
		chainwork: string;
		pruned: boolean;
		warnings: string;
	};
};
