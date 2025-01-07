import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle, parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import {
	BetIncreaseCondition,
	CrashAutobetSection,
} from "@enums/crash-autobet-section";
import { CsvFilesName } from "@enums/csv-file-name";

const crashIncreaseBy = parse_csv(
	DATASETS_DIR,
	CsvFilesName.CRASH_INCREASE_BY,
) as {
	increase_by: string;
	your_bet: string;
	auto_cashout: string;
	increase_multiplier: string;
	stop_if_more_than: string;
}[];

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

	test("[ENG-2663] Crash - Start Autobet button is active @originals", async ({
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
		await crashGamePage
			.steps()
			.enableAutobetAndFillAmount(betTestData.betAmount);
	});

	crashIncreaseBy.forEach((record) => {
		test(`[ENG-2541] Crash - Autobet - Increase by [${record.increase_by}] @originals`, async ({
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
			await crashGamePage
				.steps()
				.toggleAutobetSetup(
					betTestData,
					Number(record.stop_if_more_than),
				);

			await crashGamePage.selectWinOrLossCondition(
				record.increase_by as
					| BetIncreaseCondition.WIN
					| BetIncreaseCondition.LOSS,
				CrashAutobetSection.INCREASE_BY,
			);
			await crashGamePage
				.steps()
				.autobetUntilBetMoreThan(
					betTestData,
					Number(record.stop_if_more_than),
					Number(record.increase_multiplier),
					record.increase_by === BetIncreaseCondition.WIN
						? BetIncreaseCondition.WIN
						: BetIncreaseCondition.LOSS,
					() =>
						crashGamePage.fillIncreaseByInput(
							Number(record.increase_multiplier),
						),
				);
		});
	});
});
