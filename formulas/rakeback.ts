/**
 * @param {number} wager - a number that represents bet amount
 * @param {number} rakeback - a number that represent rakeback percentage. The house edge is 3% for Crash, Roulette, HiLo, Sports and eSports. It is 1% for Dice and custom for Casino games.
 * @param {number} houseEdge - a number that represents houseEdge
 *
 * @return {number}
 */

import { roundToDecimals } from "@core/utils/utils";

export function calculateRakeback(
	wager: number,
	rakeback: number,
	houseEdge: number,
): number {
	return roundToDecimals(((wager * rakeback) / 100) * houseEdge, 2);
}
