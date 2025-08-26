import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle, parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "../enums/csv-file-name";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";

const crashAutoCashout = parse_csv(
	DATASETS_DIR,
	CsvFilesName.CRASH_AUTO_CASHOUT,
) as {
	your_bet: string;
	auto_cashout: string;
	expected_results: string;
}[];

test.describe(
	"Crash tests",
	testDetails().withTags(TestTag.ORIGINALS).apply(),
	() => {
		test.use(storageStateNewUserDB({ amount: SUPER_HIGH_USER_AMOUNT }));
		test.slow();

		test.beforeEach(async ({ homePage }) => {
			await homePage.navigate();
		});

		test.slow();
		test(
			"[ENG-265] Place a single bet on Crash and try to cashout",
			testDetails()
				.withTags(TestTag.SMOKE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ crashGamePage, userBalanceHandler }, testInfo) => {
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
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.COINS,
						Currency.USD,
						WalletType.DEFAULT,
					);

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

				const accountBalanceAfterBet =
					await userBalanceHandler.walletBalanceInFiatRounded(
						Unit.COINS,
						Currency.USD,
						WalletType.DEFAULT,
					);

				await crashGamePage
					.assertThat()
					.verifyBalance(accountBalanceAfterBet, expectedBalance);
			},
		);

		crashAutoCashout.forEach((record) => {
			test(
				`[ENG-1118] Crash - Auto Cashout with: [${record.your_bet}] value bets`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
				async ({ crashGamePage }, testInfo) => {
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

					const expectedBalance =
						crashGamePage.calculateExpectedBalance(
							accountBalanceBeforeBet,
							totalBetsPlaced,
							winnings,
						);

					await crashGamePage.authenticatedHeader
						.assertThat()
						.accountBalanceIs(expectedBalance);
				},
			);
		});
	},
);
