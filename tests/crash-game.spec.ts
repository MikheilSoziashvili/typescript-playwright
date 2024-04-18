import { test } from "../fixtures/fixtures";
import { BetTestData } from "../dtos/test-data";
import { storageStateUser1 } from "../fixtures/auth-fixtures";

test.describe("Crash tests", () => {
	test.use(storageStateUser1);
	test("[ENG-265] Place a single bet on Crash and try to cashout @smoke", async ({
		homePage,
		crashGamePage,
	}) => {
		const betTestData: BetTestData = new BetTestData(
			"user1",
			10,
			Number("1.10"),
		);
		await crashGamePage.navigate();
		await crashGamePage.playUntilMultiplierIs(
			betTestData.autoCashoutMultiplier,
			async () => {
				await crashGamePage.navigate();

				const accountBalanceBeforeBet =
					await homePage.getAccountBalance();

				await crashGamePage.steps().placeBet(betTestData);

				await homePage
					.assertThat()
					.accountBalanceIs(
						accountBalanceBeforeBet - betTestData.betAmount,
					);
			},
		);
	});
});
