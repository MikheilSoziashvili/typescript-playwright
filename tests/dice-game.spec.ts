import { DiceGameResultMessage } from "../enums/dice-result-messages";
import { test } from "../fixtures/fixtures";
import { logger } from "../logger/logger";
import { DiceBetTestData } from "../dtos/test-data";

test("[QA-122] Place a single bet on Dice and try to win @smoke", async ({
	homePage,
	diceGamePage,
}) => {
	await homePage.navigateAndCheckTitle();
	await homePage.openLoginModal();
	await homePage.loginModal.loginAsUser("user1");
	await homePage.assertThat().userIsLoggedIn();

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

	let isWin = false;

	while (!isWin) {
		const accountBalanceBeforeBet = await homePage.getAccountBalance();

		await diceGamePage.fillInBetData(
			diceBetData.betAmount,
			diceBetData.multiplier,
		);

		await diceGamePage
			.assertThat()
			.betValuesAreCorrect("34.000000", "1.50", "66.00", "0.50");
		await diceGamePage.assertThat().diceValueIsCorrect("34.00");

		await diceGamePage.rollDice();

		await diceGamePage.assertThat().diceMessageIsNotEmpty();
		await diceGamePage.assertThat().diceResultIsDisplayed();

		const diceGameAreaMessage =
			await diceGamePage.map.diceGameAreaMessage.textContent();
		isWin = diceGameAreaMessage === DiceGameResultMessage.WIN;

		if (diceBetData.multiplier != undefined) {
			const expectedBalance = isWin
				? accountBalanceBeforeBet +
				  diceBetData.betAmount * (diceBetData.multiplier - 1)
				: accountBalanceBeforeBet - diceBetData.betAmount;
			await homePage.assertThat().accountBalanceIs(expectedBalance);
		}

		if (!isWin) {
			logger.info("Dice game lost! Rolling dice again...");
		}
	}

	await diceGamePage.assertThat().diceMessageIs(DiceGameResultMessage.WIN);
});
