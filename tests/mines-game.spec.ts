import { VERY_LOW_USER_AMOUNT } from "@constants/user-amounts";
import { calculateMinesMultiplier } from "@core/utils/utils";
import { MinesBetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";

test.describe("Mines tests", () => {
	test.use(storageStateNewUserDB({ amount: VERY_LOW_USER_AMOUNT }));
	test.slow();

	const minesBetData = new MinesBetTestData({
		minesNumber: 1,
		cashoutMultiplier: calculateMinesMultiplier({
			stepNumber: 24,
			mines: 1,
			houseEdge: 0.01,
		}),
	});

	logger.info(`Cashout multiplier: ${minesBetData.cashoutMultiplier}`);

	test.beforeEach(async ({ homePage }) => {
		await homePage.navigate();
	});

	test(`[ENG-6486] Mines - place a bet and try to win - Pick random tiles @originals`, async ({
		minesGamePage,
	}) => {
		await minesGamePage.navigateAndWaitForGameToLoad();

		await minesGamePage.steps().placeBetAndConfigureMines(minesBetData);

		const accountBalanceBeforeBet =
			await minesGamePage.authenticatedHeader.getAccountBalance();

		const totalBetsPlaced = await minesGamePage.pickRandomTilesUntilWin(
			minesBetData.betAmount,
		);

		await minesGamePage.assertThat().winImageIsDisplayed();

		await minesGamePage
			.assertThat()
			.accountBalanceAfterWinIsCorrect(
				accountBalanceBeforeBet,
				minesBetData.betAmount,
				totalBetsPlaced,
				minesBetData.cashoutMultiplier,
			);
	});
});
