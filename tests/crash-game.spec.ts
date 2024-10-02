import { test } from "@fixtures/fixtures";
import { BetTestData, RegisterTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";

const userCredentials = new RegisterTestData();
test.describe("Crash tests", () => {
	test.use(storageStateNewUserAPI({ username: userCredentials.username }));
	test.slow();

	test("[ENG-265] Place a single bet on Crash and try to cashout @smoke @originals", async ({
		crashGamePage,
	}) => {
		const betTestData: BetTestData = new BetTestData(
			userCredentials.username,
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
