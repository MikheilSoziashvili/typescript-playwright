import { KenoRisk } from "@enums/keno/keno-risk";
import { KenoSelectedNumber } from "@enums/keno/keno-selected-numbers";

export interface KenoPlaceBetOptions {
	selectedNumbers?: KenoSelectedNumber[];
	risk?: KenoRisk;
	isAutobet?: boolean;
	refClientId?: string;
	headers?: Record<string, string>;
}
