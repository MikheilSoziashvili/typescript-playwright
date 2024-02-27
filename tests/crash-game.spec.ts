import { test } from "../fixtures/fixtures";
import { logger } from "../logger/logger";
import { BetTestData } from "../dtos/test-data";
import { parseMultiplier } from "../core/utils";

test("[QA-77] Place a single bet on Crash and try to cashout @smoke", async ({
	homePage,
	crashGamePage,
}) => {
	const betTestData: BetTestData = new BetTestData(
		"user1",
		10,
		Number("1.10"),
	);

	await homePage.navigateAndCheckTitle();
	await homePage.openLoginModal();

	await homePage.loginModal.loginAsUser(betTestData.username);
	await homePage.assertThat().userIsLoggedIn();

	//reset game until multiplier is greater than or equal to betTestData.autoCashoutMultiplier
	let crashedMultiplier: number = 0.0;
	do {
		if (crashedMultiplier == 0.0) {
			logger.info("New Crash game will be opened");
		} else if (
			crashedMultiplier > 0.0 &&
			crashedMultiplier < betTestData.autoCashoutMultiplier
		) {
			logger.warn("Multiplier crashed below expected. Will retry bet...");
		}

		await crashGamePage.navigate();

		const accountBalanceBeforeBet = await homePage.getAccountBalance();

		await crashGamePage.placeBet(
			betTestData.betAmount,
			betTestData.autoCashoutMultiplier,
		);
		await crashGamePage.assertThat().playerBetsAccepted([
			{
				username: betTestData.username,
				betAmount: `${betTestData.betAmount}`,
			},
		]);
		await crashGamePage
			.assertThat()
			.playerBetBoxesDisplayed([
				{ betAmount: `${betTestData.betAmount.toFixed(2)}` },
			]);

		await homePage
			.assertThat()
			.accountBalanceIs(accountBalanceBeforeBet - betTestData.betAmount);

		crashedMultiplier = parseMultiplier(
			await crashGamePage.getCrashedMultiplier(),
		);
	} while (crashedMultiplier < betTestData.autoCashoutMultiplier);
});
