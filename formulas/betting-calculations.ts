import { parseToFloat } from "@core/utils/utils";
import { DiceBetTestData } from "@dtos/test-data";
import { expect } from "@playwright/test";

/**
 * Calculates the expected profit from a bet with proper rounding to 2 decimal places.
 * This prevents floating point precision issues in test assertions.
 *
 * @param betMultiplier - The multiplier applied to the bet
 * @param betAmount - The original bet amount
 * @returns The calculated profit rounded to 2 decimal places
 */
export const calculateRoundedExpectedProfit = (
	betMultiplier: number,
	betAmount: number,
): number => {
	const profitCalculated = Math.round(betMultiplier * betAmount * 100) / 100;
	return profitCalculated;
};

export function getExpectedDiceBetValues(betData: DiceBetTestData): {
	rollOver: string;
	multiplier: string;
	winChance: string;
	profitOnWin: string;
	diceSliderValue?: string;
} {
	expect(
		betData.multiplier,
		"Multiplier must be defined for bet value calculations.",
	).not.toBeUndefined();

	expect(
		betData.multiplier,
		"Bet multiplier must be greater than 0",
	).toBeGreaterThan(0);

	const multiplier = betData.multiplier as number;
	const betAmount = betData.betAmount;

	const userEdgeDecimal = 0.999;
	const winChance = (100 * userEdgeDecimal) / multiplier;
	const rollOver = 100 - winChance;
	const profitOnWin = betAmount * (multiplier - 1);
	const diceSliderValue = 100 - winChance;

	return {
		rollOver: parseToFloat(rollOver, 6),
		multiplier: parseToFloat(multiplier),
		winChance: parseToFloat(winChance),
		profitOnWin: parseToFloat(profitOnWin),
		diceSliderValue: parseToFloat(diceSliderValue),
	};
}

export const calculateBetAmountWithPercentage = (
	betAmount: number,
	percentage: number,
): number => parseFloat((betAmount * (1 + percentage / 100)).toFixed(2));

export const calculateBalanceAfterProfit = (
	initialBalance: number,
	betAmount: number,
	multiplier: number,
): number => initialBalance + betAmount * (multiplier - 1);
