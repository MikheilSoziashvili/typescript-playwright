import { MinesCount } from "@enums/mines/mines-count";

export interface MinesPlaceBetOptions {
	minesCount?: MinesCount;
	isAutobet?: boolean;
	headers?: Record<string, string>;
}
