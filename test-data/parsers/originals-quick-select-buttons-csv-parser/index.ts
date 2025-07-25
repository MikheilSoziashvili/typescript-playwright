import { OriginalsQuickSelectButtonsCsvRecord } from "@dtos/csv";
import {
	OriginalsQuickSelectButtons,
	OriginalGame,
} from "@enums/original-games";

export interface OriginalsQuickSelectButtonsCsvParsedRecord {
	buttonType: OriginalsQuickSelectButtons;
	game: OriginalGame;
	initialBetAmount: number;
	expectedAfterFirstClick: number;
	expectedAfterSecondClick: number;
}

export const parseOriginalsQuickSelectButtonsCsvRow = (
	row: OriginalsQuickSelectButtonsCsvRecord,
): OriginalsQuickSelectButtonsCsvParsedRecord => ({
	buttonType: row.buttonType as OriginalsQuickSelectButtons,
	game: OriginalGame[row.game as keyof typeof OriginalGame],
	initialBetAmount: parseFloat(row.initialBetAmount),
	expectedAfterFirstClick: parseFloat(row.expectedAfterFirstClick),
	expectedAfterSecondClick: parseFloat(row.expectedAfterSecondClick),
});
