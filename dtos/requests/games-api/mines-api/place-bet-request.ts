import { MinesCount } from "@enums/mines/mines-count";

export type MinesPlaceBetRequest = {
	minesCount: MinesCount;
	amountInUnit: number;
	isAutobet: boolean;
	token: string;
};
