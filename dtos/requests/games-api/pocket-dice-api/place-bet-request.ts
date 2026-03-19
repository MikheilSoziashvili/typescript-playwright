import { PocketDiceApiBetOn, PocketDiceApiRollType } from "@enums/pocket-dice-api-enums";

export type PocketDicePlaceBetRequest = {
	betOn: PocketDiceApiBetOn;
	rollType: PocketDiceApiRollType;
	amountInUnit: number;
	isAutobet: boolean;
	token: string;
};
