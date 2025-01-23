export function calculateCardsPercentage(
	cardsColorCount: number,
	totalCards: number,
): number {
	return Math.round((cardsColorCount / totalCards) * 100);
}
