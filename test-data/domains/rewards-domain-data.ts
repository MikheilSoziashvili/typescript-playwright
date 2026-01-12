import { CsvFilesName } from "@enums/csv-file-name";
import { RoyaltyUpLevelRanksCsvParsedRecord } from "test-data/parsers/royalty-up-level-ranks-csv-parser";
import { testData } from "test-data/test-data-manager";

export class RewardsDomainData {
	/**
	 * Returns all royalty up level rank scenarios from CSV.
	 *
	 * @returns Array of royalty up level rank test scenarios
	 */
	public royaltyUpLevelRanks(): RoyaltyUpLevelRanksCsvParsedRecord[] {
		return testData().fromCsvParsed({
			file: CsvFilesName.ROYALTY_UP_LEVEL_RANKS,
		});
	}
}
