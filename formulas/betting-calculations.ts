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
