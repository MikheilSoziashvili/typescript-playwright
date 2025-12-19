import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";

export interface DiceMaxBetPotentialWinScenario {
	betAmount: number;
	multiplier: number;
	assertDiceRollResult: (diceGamePage: DiceGamePage) => Promise<void>;
	skipScenario?: boolean;
}
