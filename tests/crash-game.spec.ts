import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { USER_1_CREDENTIALS } from "@constants/credentials";

test.describe("Crash tests", () => {
	test.use(storageStateUserAPI(USER_1_CREDENTIALS.username));
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

		const accountBalanceBeforeBet =
			await crashGamePage.authenticatedHeader.getAccountBalance();

		let totalBetsPlaced = 0;
		let winnings = 0;

		await crashGamePage.playUntilMultiplierIs(
			betTestData.autoCashoutMultiplier,
			betTestData.betAmount,
			async () => {
				await crashGamePage.steps().placeBet(betTestData);
				totalBetsPlaced = crashGamePage.trackTotalBets(
					betTestData.betAmount,
					totalBetsPlaced,
				);
			},
		);

		winnings = crashGamePage.calculateWinnings(
			betTestData.betAmount,
			betTestData.autoCashoutMultiplier,
		);

		const expectedBalance = crashGamePage.calculateExpectedBalance(
			accountBalanceBeforeBet,
			totalBetsPlaced,
			winnings,
		);

		await crashGamePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(expectedBalance);
	});
});
