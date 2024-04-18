import { DiceGameResultMessage } from "../enums/dice-result-messages";
import { test } from "../fixtures/fixtures";
import { DiceBetTestData } from "../dtos/test-data";
import { storageStateUser1 } from "../fixtures/auth-fixtures";

test.describe("Dice tests", () => {
	test.use(storageStateUser1);
	test("[ENG-299] Place a single bet on Dice and try to win @smoke", async ({
		homePage,
		diceGamePage,
	}) => {
		await diceGamePage.navigate();
		await diceGamePage
			.assertThat()
			.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

		const diceBetData = new DiceBetTestData(
			parseFloat("1.00"),
			parseFloat("1.50"),
		);

		await diceGamePage.fillInBetData(diceBetData.betAmount);
		await diceGamePage
			.assertThat()
			.betAndProfitOnWinValuesAreCorrect(
				diceBetData.betAmount,
				parseFloat("1.00"),
			);

		await diceGamePage
			.steps()
			.playUntilResultMesssageIs(
				DiceGameResultMessage.WIN,
				diceBetData,
				homePage,
			);

		await diceGamePage
			.assertThat()
			.diceMessageIs(DiceGameResultMessage.WIN);
	});
});
