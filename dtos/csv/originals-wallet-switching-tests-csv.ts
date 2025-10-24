import { OriginalGame } from "@enums/original-games";
import { Unit } from "@enums/units";
import { Wallet } from "@enums/wallets";

export interface OriginalsWalletSwitchingTestsCsvRecord {
	game: OriginalGame;
	wallet: Wallet;
	unit: Unit;
}

export type OriginalsWalletSwitchingTestsCsv =
	OriginalsWalletSwitchingTestsCsvRecord[];
