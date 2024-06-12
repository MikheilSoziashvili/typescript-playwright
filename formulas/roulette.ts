export function calculateGreenHuntAmountByPercentage(
	betAmount: number,
	percentage: number,
): number {
	return betAmount * (percentage / 100);
}
