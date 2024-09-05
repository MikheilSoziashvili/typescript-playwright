import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceBetTestData } from "@dtos/test-data";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";

test.describe("Dice tests", () => {
	test.use(storageStateUserAPI("user1", "password"));
	test("[ENG-299] Place a single bet on Dice and try to win @smoke @originals", async ({
		diceGamePage,
	}) => {
		await diceGamePage.navigate();
		await diceGamePage
			.assertThat()
			.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

		const diceBetData = new DiceBetTestData({
			betAmount: 1,
			multiplier: 1.5,
		});

		await diceGamePage.fillInManualBetData(diceBetData.betAmount);
		await diceGamePage
			.assertThat()
			.manualBetAndProfitOnWinValuesAreCorrect(
				diceBetData.betAmount,
				diceBetData.betAmount,
			);

		await diceGamePage
			.steps()
			.playUntilResultMesssageIs(DiceGameResultMessage.WIN, diceBetData);

		await diceGamePage
			.assertThat()
			.diceMessageIs(DiceGameResultMessage.WIN);
	});
});
