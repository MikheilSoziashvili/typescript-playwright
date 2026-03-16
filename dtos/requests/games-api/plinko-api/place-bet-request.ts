import { PlinkoRisk } from "@enums/plinko/plinko-risk";

export type PlinkoPlaceBetRequest = {
	risk: PlinkoRisk;
	rows: number;
	token: string;
	isAutobet: boolean;
	amountInUnit: number;
	refClientId: string;
	clientVersion: string;
};
