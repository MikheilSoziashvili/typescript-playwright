import { RoyaltyUpSkippingLevelsCsvRecord } from "@dtos/csv";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";

export interface RoyaltyUpSkippingLevelsCsvParsedRecord {
	currentLevel: RewardsRoyaltyUpRanks;
	requiredXpToUpgrade: string;
	newLevel: RewardsRoyaltyUpRanks;
	userBeXp: number;
	ranksRewards: number[];
	claimableRewards: RewardsRoyaltyUpRanks[];
	unclaimableRewards: RewardsRoyaltyUpRanks[];
}

/**
 * Parse a pipe-separated string into an array of numbers
 * @param value - The pipe-separated string (e.g., "0|1|2")
 * @returns Array of numbers
 */
function parsePipeSeparatedNumbers(value: string): number[] {
	if (!value || value.trim() === "") {
		return [];
	}
	return value.split("|").map((item) => Number(item.trim()));
}

/**
 * Convert CSV rank format to enum value
 * @param csvRank - The rank from CSV (e.g., "Bronze_1", "Unranked_1")
 * @returns The corresponding enum value (e.g., "Bronze 1", "Unranked_1")
 */
function convertCsvRankToEnumValue(csvRank: string): RewardsRoyaltyUpRanks {
	// Special case: Unranked_1 and Unranked_2 stay as-is (they don't exist in enum)
	if (csvRank === "Unranked_1" || csvRank === "Unranked_2") {
		return csvRank as RewardsRoyaltyUpRanks;
	}

	// Convert underscore to space for all other ranks (e.g., "Bronze_1" -> "Bronze 1")
	return csvRank.replace("_", " ") as RewardsRoyaltyUpRanks;
}

/**
 * Parse a pipe-separated string into an array of RewardsRoyaltyUpRanks
 * @param value - The pipe-separated string (e.g., "Bronze_1|Bronze_2|Bronze_3")
 * @returns Array of RewardsRoyaltyUpRanks
 */
function parsePipeSeparatedRanks(value: string): RewardsRoyaltyUpRanks[] {
	if (!value || value.trim() === "") {
		return [];
	}
	return value
		.split("|")
		.map((item) => convertCsvRankToEnumValue(item.trim()));
}

export const parseRoyaltyUpSkippingLevelsCsvRow = (
	row: RoyaltyUpSkippingLevelsCsvRecord,
): RoyaltyUpSkippingLevelsCsvParsedRecord => ({
	currentLevel: convertCsvRankToEnumValue(row.currentLevel),
	requiredXpToUpgrade: row.requiredXpToUpgrade,
	newLevel: convertCsvRankToEnumValue(row.newLevel),
	userBeXp: Number(row.userBeXp),
	ranksRewards: parsePipeSeparatedNumbers(row.ranksRewards),
	claimableRewards: parsePipeSeparatedRanks(row.claimableRewards),
	unclaimableRewards: parsePipeSeparatedRanks(row.unclaimableRewards),
});
