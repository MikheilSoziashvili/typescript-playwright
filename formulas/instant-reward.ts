// formulas/instant-reward.ts
import { HouseEdgeValue } from "@enums/house-edge-values";
import { OriginalGame } from "@enums/original-games";

/**
 * Calculates the instant reward based on the bet amount and the game's house edge.
 *
 * Formula: betAmount * 0.01 * (houseEdge) * 100 * 0.05
 * This simplifies to: betAmount * houseEdge * 0.05
 *
 * @param {OriginalGame} game - The game type.
 * @param {number} betAmount - The amount of the bet.
 * @returns {number} - The calculated reward.
 */
export function calculateInstantReward(
	game: OriginalGame,
	betAmount: number,
): number {
	const houseEdge = HouseEdgeValue[game as keyof typeof HouseEdgeValue];
	return betAmount * houseEdge * 0.05;
}
