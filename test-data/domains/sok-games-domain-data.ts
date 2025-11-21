import { PocketDiceRollType } from "@enums/pocket-dice-enums";
import { SokGamesAutobetIncreaseByScenario } from "test-data/interfaces/domain/sok-games-domain-interfaces";
import { predefined } from "test-data/sources/predefined";

export class SokGamesDomainData {
	public readonly autobetCount = predefined.sokAutobet.autobetCount;

	public readonly pocketDiceRollTypes = [
		PocketDiceRollType.UNDER,
		PocketDiceRollType.OVER,
	];

	public readonly autobetIncreaseByScenarios: SokGamesAutobetIncreaseByScenario[] =
		[
			{
				betAmount: predefined.sokAutobet.betAmount,
				onWin: predefined.sokAutobet.onWinIncrease20,
				onLoss: predefined.sokAutobet.onLossIncrease50,
			},
			{
				betAmount: predefined.sokAutobet.betAmountLow,
				onWin: predefined.sokAutobet.onWinIncrease50,
				onLoss: predefined.sokAutobet.onLossIncrease20,
			},
		];
}
