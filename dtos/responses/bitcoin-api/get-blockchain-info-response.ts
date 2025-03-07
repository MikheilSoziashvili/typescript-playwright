import { BitcoinRpcResponseBase } from "@core/interfaces";

export type GetBlockchainInfoResponse = BitcoinRpcResponseBase & {
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
