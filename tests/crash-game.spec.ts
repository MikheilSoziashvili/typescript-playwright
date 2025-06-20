import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle, parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "../enums/csv-file-name";
import { SUPER_HIGH_USER_AMOUNT } from "@constants/user-amounts";

const crashAutoCashout = parse_csv(
	DATASETS_DIR,
	CsvFilesName.CRASH_AUTO_CASHOUT,
) as {
	your_bet: string;
	auto_cashout: string;
	expected_results: string;
}[];

test.describe("Crash tests", () => {
	test.use(storageStateNewUserDB({ amount: SUPER_HIGH_USER_AMOUNT }));
	test.slow();

	test.beforeEach(async ({ homePage }) => {
		await homePage.navigate();
	});

	test.slow();
	test("[ENG-265] Place a single bet on Crash and try to cashout @smoke @originals", async ({
		crashGamePage,
		userBalanceHandler,
	}, testInfo) => {
		const newUserDetails = getUserDetailsByTestTitle(
			testInfo.title,
			testInfo.workerIndex,
		);
		const betTestData: BetTestData = new BetTestData(
			newUserDetails.username,
			10,
			Number("1.10"),
		);

		await crashGamePage.navigate();

		const accountBalanceBeforeBet = await userBalanceHandler.parseAmount();

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

		const backendCoinsAfter =
			await userBalanceHandler.walletBalanceInCoins();

		const expectedBalanceInCoins =
			userBalanceHandler.usdToCoins(expectedBalance);

		await crashGamePage
			.assertThat()
			.verifyBalance(backendCoinsAfter, expectedBalanceInCoins);

		await crashGamePage.assertThat().backendVsUiBalanceMatch();
	});

	crashAutoCashout.forEach((record) => {
		test(`[ENG-1118] Crash - Auto Cashout with: [${record.your_bet}] value bets @originals`, async ({
			crashGamePage,
		}, testInfo) => {
			const newUserDetails = getUserDetailsByTestTitle(
				testInfo.title,
				testInfo.workerIndex,
			);

			const betTestData: BetTestData = new BetTestData(
				newUserDetails.username,
				Number(record.your_bet),
				Number(record.auto_cashout),
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

			await crashGamePage
				.assertThat()
				.isExpectedAndActualWinningMatch(
					Number(record.expected_results),
					winnings,
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
});
