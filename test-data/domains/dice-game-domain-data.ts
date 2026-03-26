import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { DiceMaxBetPotentialWinScenario } from "test-data/interfaces/domain/dice-game-domain-interfaces";

export class DiceGameDomainData {
	public readonly diceMaxBetPotentialWinScenarios: DiceMaxBetPotentialWinScenario[] =
		[
			{
				betAmount: 499999,
				multiplier: 300,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.assertThat().diceResultIsDisplayed(),
			},
			{
				betAmount: 500000,
				multiplier: 3000,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.assertThat().diceResultIsDisplayed(),
			},
			{
				betAmount: 50000.01,
				multiplier: 300,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.toast
						.assertThat()
						.toastMessageIs(
							ToastTitle.FAILED,
							ToastSubTitle.BET_TOO_HIGH,
						),
				skipScenario: true,
			},
			{
				betAmount: 500000,
				multiplier: 301,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.toast
						.assertThat()
						.toastMessageIs(
							ToastTitle.FAILED,
							ToastSubTitle.DICE_POTENTIAL_WIN_TOO_HIGH,
						),
			},
			{
				betAmount: 500001,
				multiplier: 301,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.toast
						.assertThat()
						.toastMessageIs(
							ToastTitle.FAILED,
							ToastSubTitle.DICE_POTENTIAL_WIN_TOO_HIGH,
						),
			},
		];
}
