import { VERY_LOW_USER_AMOUNT } from "database/constants/user-amounts";
import { calculateMinesMultiplier } from "@core/utils/utils";
import { MinesAutobetTestData, MinesBetTestData } from "@dtos/test-data";
import { BrowserName } from "@enums/playwright/project-browser-names";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";

test.describe("Mines tests", () => {
	test.use(storageStateNewUserDB({ amount: VERY_LOW_USER_AMOUNT }));
	test.slow();

	const minesBetData = new MinesBetTestData({
		minesNumber: 0, // default sliuder value for 1 mine
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
		async ({ minesGamePage, userBalanceHandler }, testInfo) => {
			test.fixme(
				testInfo.project.name === BrowserName.FIREFOX,
				"https://gamdom.atlassian.net/browse/ENG-7162",
			);
			await minesGamePage.navigateAndWaitForGameToLoad();

			await minesGamePage.steps().placeBetAndConfigureMines(minesBetData);

			const accountBalanceBeforeBet =
				await userBalanceHandler.walletBalanceInUsd();

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
		async ({ minesGamePage, userBalanceHandler }) => {
			await minesGamePage.navigateAndWaitForGameToLoad();

			await minesGamePage.steps().placeBetAndConfigureMines(minesBetData);

			const accountBalanceBeforeBet =
				await userBalanceHandler.walletBalanceInUsd();

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
		`[ENG-5729] Mines - Verify Game History`,
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

	test(
		`[ENG-6143] Mines - Autobet Increase By`,
		{
			tag: ["@originals", "@mines"],
		},
		async ({ minesGamePage }) => {
			const minesBetDataForAutobet = new MinesBetTestData({
				betAmount: 1,
				minesNumber: 3,
				cashoutMultiplier: calculateMinesMultiplier({
					stepNumber: 1,
					mines: 4,
					houseEdge: 0.01,
				}),
			});

			const minesAutobetData = new MinesAutobetTestData({
				numberOfAutobetRounds: 1,
				onWinIncreaseByPercent: 20,
				onLossIncreaseByPercent: 50,
			});

			await minesGamePage.navigateAndWaitForGameToLoad();

			await minesGamePage
				.steps()
				.openAndConfigureAutobet(
					minesBetDataForAutobet,
					minesAutobetData.numberOfAutobetRounds,
					minesAutobetData.onWinIncreaseByPercent,
					minesAutobetData.onLossIncreaseByPercent,
				);

			await minesGamePage
				.steps()
				.pickRandomTilesUntilBombCaughtAutobet(
					minesBetDataForAutobet.betAmount,
					minesAutobetData.onWinIncreaseByPercent,
					minesAutobetData.onLossIncreaseByPercent,
					minesBetDataForAutobet.cashoutMultiplier,
				);
		},
	);
});
