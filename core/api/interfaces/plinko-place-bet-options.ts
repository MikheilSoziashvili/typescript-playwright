import { PlinkoRisk } from "@enums/plinko/plinko-risk";

export interface PlinkoPlaceBetOptions {
	risk?: PlinkoRisk;
	rows?: number;
	isAutobet?: boolean;
	refClientId?: string;
	clientVersion?: string;
	headers?: Record<string, string>;
}
