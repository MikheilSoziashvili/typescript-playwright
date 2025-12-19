import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { DiceGamePage } from "@pages/dice-game-page/dice-game-page";
import { DiceMaxBetPotentialWinScenario } from "test-data/interfaces/domain/dice-game-domain-interfaces";

export class DiceGameDomainData {
	public readonly diceMaxBetPotentialWinScenarios: DiceMaxBetPotentialWinScenario[] =
		[
			{
				betAmount: 999,
				multiplier: 800,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.assertThat().diceResultIsDisplayed(),
			},
			{
				betAmount: 1000,
				multiplier: 800,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.assertThat().diceResultIsDisplayed(),
			},
			{
				betAmount: 1000.01,
				multiplier: 800,
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
				betAmount: 1000,
				multiplier: 801,
				assertDiceRollResult: (diceGamePage: DiceGamePage) =>
					diceGamePage.toast
						.assertThat()
						.toastMessageIs(
							ToastTitle.FAILED,
							ToastSubTitle.DICE_POTENTIAL_WIN_TOO_HIGH,
						),
			},
			{
				betAmount: 1001,
				multiplier: 810,
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
