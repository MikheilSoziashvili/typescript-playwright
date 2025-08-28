import { OriginalsQuickSelectButtonsCsvRecord } from "@dtos/csv";
import {
	OriginalsQuickSelectButtons,
	OriginalGame,
} from "@enums/original-games";

export interface OriginalsQuickSelectButtonsCsvParsedRecord {
	buttonType: OriginalsQuickSelectButtons;
	game: OriginalGame;
	currency: string;
	initialBetAmount: number;
	minOrMaxAmount: number;
	expectedAfterFirstClick: number;
	expectedAfterSecondClick: number;
}

export const parseOriginalsQuickSelectButtonsCsvRow = (
	row: OriginalsQuickSelectButtonsCsvRecord,
): OriginalsQuickSelectButtonsCsvParsedRecord => ({
	buttonType: row.buttonType as OriginalsQuickSelectButtons,
	game: OriginalGame[row.game as keyof typeof OriginalGame],
	currency: row.currency,
	initialBetAmount: parseFloat(row.initialBetAmount),
	minOrMaxAmount: parseFloat(row.minOrMaxAmount),
	expectedAfterFirstClick: parseFloat(row.expectedAfterFirstClick),
	expectedAfterSecondClick: parseFloat(row.expectedAfterSecondClick),
});
