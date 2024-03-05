import { RouletteNumberColor } from "../enums/original-games";
import { test } from "../fixtures/fixtures";
import { logger } from "../logger/logger";
import { BetTestData } from "../dtos/test-data";
import { USER_1_AUTH_STATE_FILE_PATH } from "../constants/file-paths";

test.describe('Roulette tests', () => {
	test.use({ storageState: USER_1_AUTH_STATE_FILE_PATH });
	test("[QA-121] Place a single bet on Roulette and try to win @smoke", async ({
		homePage,
		rouletteGamePage,
	}) => {
		test.slow(); // it takes some more time until a 'red' number is in

		const betTestData: BetTestData = new BetTestData("user1", 1, 1);
		await rouletteGamePage.navigate();

		let isWin: RouletteNumberColor = RouletteNumberColor.RED;
		let rouletteResultNumber: string;

		let accountBalanceLeft: number;
		do {
			await rouletteGamePage.waitBettingWindowAvailable();

			await rouletteGamePage.insertBet(betTestData.betAmount);
			await rouletteGamePage.assertThat().betButtonsEnabled();
			await rouletteGamePage
				.assertThat()
				.potentialBenefitValueIs(
					betTestData.betAmount,
					RouletteNumberColor.RED,
				);

			await rouletteGamePage.betOnColor(RouletteNumberColor.RED);

			await rouletteGamePage
				.assertThat()
				.potentialBenefitValueIs(
					betTestData.betAmount,
					RouletteNumberColor.RED,
					false,
				);
			await rouletteGamePage
				.assertThat()
				.playerBetDisplayed(
					RouletteNumberColor.RED,
					betTestData.username,
					betTestData.betAmount,
				);

			await rouletteGamePage
				.assertThat()
				.totalBetsAre(RouletteNumberColor.RED, 1, 1);

			accountBalanceLeft = await homePage.getAccountBalance();

			rouletteResultNumber = await rouletteGamePage.getRoundResultNumber();
			isWin =
				(await rouletteGamePage.getRoundResultColor()) as RouletteNumberColor;

			logger.info(`Roulette result: ${RouletteNumberColor[isWin]}`);
		} while (isWin !== RouletteNumberColor.RED);

		await rouletteGamePage
			.assertThat()
			.profitAmountDisplayed(RouletteNumberColor.RED, betTestData.betAmount);

		const expectedProfit = rouletteGamePage.calculateProfit(
			betTestData.betAmount,
			RouletteNumberColor.RED,
		);
		await homePage
			.assertThat()
			.accountBalanceIs(accountBalanceLeft + expectedProfit);

		await rouletteGamePage
			.assertThat()
			.previousRollsHistoryUpdated(rouletteResultNumber);
	});
});
