import { CasinoGameInstantRewardsRoyaltyUpLevelsCsvRecord } from "@dtos/csv/casino-game-instant-rewards-royalty-up-levels-csv";
import { CasinoGameName, GameProvider, GameProviderCode } from "@enums/casino-game";

export interface CasinoGameInstantRewardsRoyaltyUpLevelsCsvParsedRecord {
	level: string;
	game: CasinoGameName;
	userBeXp: number;
	gameProvider: GameProvider;
	providerCode: GameProviderCode;
}

export const parseCasinoGameInstantRewardsRoyaltyUpLevelsCsvRow = (
	row: CasinoGameInstantRewardsRoyaltyUpLevelsCsvRecord,
): CasinoGameInstantRewardsRoyaltyUpLevelsCsvParsedRecord => ({
	level: row.level,
	game: row.game as CasinoGameName,
	userBeXp: Number(row.userBeXp),
	gameProvider: row.gameProvider as GameProvider,
	providerCode: row.providerCode as GameProviderCode,
});
