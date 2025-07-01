import { VERY_LOW_USER_AMOUNT } from "database/constants/user-amounts";
import { calculateMinesMultiplier } from "@core/utils/utils";
import { MinesBetTestData } from "@dtos/test-data";
import { BrowserName } from "@enums/playwright/project-browser-names";
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

	test(
		`[ENG-6486] Mines - place a bet and try to win - Pick random tiles`,
		{
			tag: ["@originals", "@mines"],
		},
		async ({ minesGamePage }, testInfo) => {
			test.fixme(
				testInfo.project.name === BrowserName.FIREFOX,
				"https://gamdom.atlassian.net/browse/ENG-7162",
			);
			await minesGamePage.navigateAndWaitForGameToLoad();

			await minesGamePage.steps().placeBetAndConfigureMines(minesBetData);

			const accountBalanceBeforeBet =
				await minesGamePage.authenticatedHeader.getAccountBalance();

			const totalBetsPlaced = await minesGamePage.pickRandomTilesUntilWin(
				minesBetData.betAmount,
				testInfo,
			);

			await minesGamePage.assertThat().winImageIsDisplayed();

			await minesGamePage
				.assertThat()
				.accountBalanceAfterGameFlowIsCorrect({
					accountBalanceBeforeBet: accountBalanceBeforeBet,
					betAmount: minesBetData.betAmount,
					totalBetsPlaced: totalBetsPlaced,
					cashoutMultiplier: minesBetData.cashoutMultiplier,
					numberOfWins: 1,
				});
		},
	);

	test(
		`[ENG-6927] Mines - Play until catch a bomb`,
		{
			tag: ["@smoke", "@originals", "@mines"],
		},
		async ({ minesGamePage }) => {
			await minesGamePage.navigateAndWaitForGameToLoad();

			await minesGamePage.steps().placeBetAndConfigureMines(minesBetData);

			const accountBalanceBeforeBet =
				await minesGamePage.authenticatedHeader.getAccountBalance();

			const { totalBetsPlaced, hasWonAtLeastOnce } =
				await minesGamePage.pickRandomTilesUntilBombIsCaught(
					minesBetData.betAmount,
				);

			await minesGamePage
				.assertThat()
				.accountBalanceAfterGameFlowIsCorrect({
					accountBalanceBeforeBet: accountBalanceBeforeBet,
					betAmount: minesBetData.betAmount,
					totalBetsPlaced: totalBetsPlaced,
					cashoutMultiplier: minesBetData.cashoutMultiplier,
					numberOfWins: hasWonAtLeastOnce ? 1 : 0,
				});
		},
	);

	test(
		`[ENG-7319] Mines - Verify Game History`,
		{
			tag: ["@originals", "@mines"],
		},
		async ({ minesGamePage }) => {
			await minesGamePage.navigateAndWaitForGameToLoad();

			await minesGamePage.steps().placeBetAndConfigureMines(minesBetData);

			const accountBalanceBeforeBet =
				await minesGamePage.authenticatedHeader.getAccountBalance();

			const { totalBetsPlaced, hasWonAtLeastOnce } =
				await minesGamePage.pickRandomTilesUntilBombIsCaught(
					minesBetData.betAmount,
				);

			await minesGamePage
				.assertThat()
				.accountBalanceAfterGameFlowIsCorrect({
					accountBalanceBeforeBet: accountBalanceBeforeBet,
					betAmount: minesBetData.betAmount,
					totalBetsPlaced: totalBetsPlaced,
					cashoutMultiplier: minesBetData.cashoutMultiplier,
					numberOfWins: hasWonAtLeastOnce ? 1 : 0,
				});

			await minesGamePage.steps().verifyBetIsShownInGameHistory();
		},
	);
});
