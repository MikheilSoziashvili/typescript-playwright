import { test } from "../fixtures/fixtures";
import { BetTestData } from "../dtos/test-data";

test("[QA-77] Place a single bet on Crash and try to cashout @smoke", async ({
	homePage,
	crashGamePage,
}) => {
	const betTestData: BetTestData = new BetTestData(
		"user1",
		10,
		Number("1.10"),
	);

	await homePage.steps().loginUsername(betTestData.username);

	await crashGamePage.playUntilMultiplierIs(
		betTestData.autoCashoutMultiplier,
		async () => {
			await crashGamePage.navigate();

			const accountBalanceBeforeBet = await homePage.getAccountBalance();

			await crashGamePage.steps().placeBet(betTestData);

			await homePage
				.assertThat()
				.accountBalanceIs(
					accountBalanceBeforeBet - betTestData.betAmount,
				);
		},
	);
});
