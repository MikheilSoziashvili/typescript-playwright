import { OriginalsWalletSwitchingTestsCsvRecord } from "@dtos/csv/originals-wallet-switching-tests-csv";
import { OriginalGame } from "@enums/original-games";
import { Unit } from "@enums/units";
import { Wallet } from "@enums/wallets";

export interface OriginalsWalletSwitchingTestsCsvParsedRecord {
	game: OriginalGame;
	wallet: Wallet;
	unit: Unit;
}

export const parseOriginalsWalletSwitchingTestsCsvRow = (
	row: OriginalsWalletSwitchingTestsCsvRecord,
): OriginalsWalletSwitchingTestsCsvParsedRecord => ({
	game: row.game,
	wallet: row.wallet,
	unit: row.unit,
});
