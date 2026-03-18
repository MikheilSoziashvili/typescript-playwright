import { KenoRisk } from "@enums/keno/keno-risk";
import { KenoSelectedNumber } from "@enums/keno/keno-selected-numbers";

export type KenoPlaceBetRequest = {
	selectedNumbers: KenoSelectedNumber[];
	amountInUnit: number;
	isAutobet: boolean;
	risk: KenoRisk;
	refClientId: string;
	token: string;
};
