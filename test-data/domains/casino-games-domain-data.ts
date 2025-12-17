import { RoundOutcome } from "@enums/casino-game";
import { CsvFilesName } from "@enums/csv-file-name";
import { CasinoGamesAggregatorProviderCsvParsedRecord } from "test-data/parsers/casino-games-aggregator-provider-csv-parser";
import { testData } from "test-data/test-data-manager";

export interface CasinoGameWithRoundOutcome
	extends CasinoGamesAggregatorProviderCsvParsedRecord {
	roundOutcome: RoundOutcome;
}

export class CasinoGamesDomainData {
	public readonly roundOutcomes: RoundOutcome[] = Object.values(RoundOutcome);

	/**
	 * Generates all casino game test scenarios with both win and lose outcomes.
	 *
	 * @returns Array of casino game configs with round outcomes
	 */
	public allGamesWithRoundOutcomes(): CasinoGameWithRoundOutcome[] {
		const games = testData().fromCsvParsed({
			file: CsvFilesName.CASINO_GAMES_AGGREGATOR_PROVIDER,
		});

		const scenarios: CasinoGameWithRoundOutcome[] = [];

		for (const game of games) {
			for (const outcome of this.roundOutcomes) {
				scenarios.push({
					...game,
					roundOutcome: outcome,
				});
			}
		}

		return scenarios;
	}

	/**
	 * Generates casino game test scenarios for a specific round outcome only.
	 *
	 * @param outcome - The round outcome to filter by
	 * @returns Array of casino game configs with the specified round outcome
	 */
	public gamesWithOutcome(
		outcome: RoundOutcome,
	): CasinoGameWithRoundOutcome[] {
		const games = testData().fromCsvParsed({
			file: CsvFilesName.CASINO_GAMES_AGGREGATOR_PROVIDER,
		});

		return games.map((game) => ({
			...game,
			roundOutcome: outcome,
		}));
	}
}

