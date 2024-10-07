import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle, parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";

const CRASH_AUTO_CASHOUT_CSV = "ENG-1118-crash-auto-cashout.csv",
	records = parse_csv(DATASETS_DIR, CRASH_AUTO_CASHOUT_CSV) as {
		your_bet: string;
		auto_cashout: string;
		expected_results: string;
	}[];

test.describe("Crash tests", () => {
	test.use(storageStateNewUserAPI({ amount: 4500000 }));
	test.slow();

	test.beforeEach(async ({ homePage }) => {
		await homePage.navigate();
	});

	test.slow();
	test("[ENG-265] Place a single bet on Crash and try to cashout @smoke @originals", async ({
		crashGamePage,
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

	records.forEach((record) => {
		test(`[ENG-1118] Crash - Auto Cashout with: [${record.your_bet}] value bets`, async ({
			crashGamePage,
		}, testInfo) => {
			test.fixme(
				record.your_bet === "500000",
				`Issue [ENG-2490] Increase amount of money on pre-seeded user1`,
			);

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
