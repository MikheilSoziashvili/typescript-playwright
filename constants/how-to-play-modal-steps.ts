import { OriginalGame } from "@enums/original-games";

export const StepsPerGame: Partial<Record<OriginalGame, number>> = {
	[OriginalGame.Plinko]: 2,
	[OriginalGame.Keno]: 3,
	[OriginalGame.Mines]: 3,
};
