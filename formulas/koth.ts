import {
	GAME_HOUSE_EDGE,
	KOTH_BASELINE_NORMALIZATION_CONSTANT,
} from "@constants/originals-game-rtp";
import { COINS_PER_USD } from "@core/handlers/user-balance-handler/user-balance-handler";

export const calculateKothPoints = (
	betAmountInCoins: number,
	game: string,
	houseEdgeOverride?: number,
): number => {
	const houseEdge = houseEdgeOverride ?? GAME_HOUSE_EDGE[game];
	const betAmountInDollars = betAmountInCoins / COINS_PER_USD;
	return (
		Math.round(
			betAmountInDollars *
				(houseEdge / KOTH_BASELINE_NORMALIZATION_CONSTANT) *
				100,
		) / 100
	);
};
