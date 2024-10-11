import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle } from "@core/utils/utils";

test.describe("Crash autobet tests", () => {
	test.use(storageStateNewUserAPI());
	test.slow();
	test("[ENG-1416] Crash - Autobet @originals", async ({
		crashGamePage,
	}, testInfo) => {
		const newUserDetails = getUserDetailsByTestTitle(
			testInfo.title,
			testInfo.workerIndex,
		);
		const betTestData: BetTestData = new BetTestData(
			newUserDetails.username,
			10,
			Number("1.5"),
		);

		await crashGamePage.navigate();

		const accountBalanceBeforeBet =
			await crashGamePage.authenticatedHeader.getAccountBalance();

		let totalBetsPlaced = 0;
		let winnings = 0;

		await crashGamePage.steps().toggleAutobetSetup(betTestData, 200);
		await crashGamePage.playUntilMultiplierIs(
			betTestData.autoCashoutMultiplier,
			betTestData.betAmount,
			async () => {
				await crashGamePage.steps().placeBet(betTestData);
				await crashGamePage.assertThat().potentialWinDisplayed(15);
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
