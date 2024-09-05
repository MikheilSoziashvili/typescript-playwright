import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";

test.describe("Crash tests", () => {
	test.use(storageStateUserAPI("qshko", "asd123fgh456"));
	test.slow();
	test("[ENG-265] Place a single bet on Crash and try to cashout @smoke @originals", async ({
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
				const accountBalanceBeforeBet =
					await crashGamePage.authenticatedHeader.getAccountBalance();

				await crashGamePage.steps().placeBet(betTestData);

				await crashGamePage.authenticatedHeader
					.assertThat()
					.accountBalanceIs(
						accountBalanceBeforeBet - betTestData.betAmount,
					);
			},
		);
	});
});
