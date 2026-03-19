import { PocketDiceApiBetOn, PocketDiceApiRollType } from "@enums/pocket-dice-api-enums";

export interface PocketDicePlaceBetOptions {
	betOn?: PocketDiceApiBetOn;
	rollType?: PocketDiceApiRollType;
	isAutobet?: boolean;
	headers?: Record<string, string>;
}
