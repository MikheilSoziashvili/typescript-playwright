export interface JackpotContributionCsvRecord {
	Game: string;
	BetAmount: string;
	JackpotIncreaseAmount: string;
}

export type JackpotContributionCsv = JackpotContributionCsvRecord[];
