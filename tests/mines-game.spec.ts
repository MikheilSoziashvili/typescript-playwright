import { testDetails } from "@core/helpers/test-details-helper";
import {
	calculateMinesMultiplier,
	getCookieHeader,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { MinesAutobetTestData, MinesBetTestData } from "@dtos/test-data";
import { Feature } from "@enums/feature";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { BrowserName } from "@enums/playwright/project-browser-names";
import { TestTag } from "@enums/test-tags";
import { UserType } from "@enums/user-types";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { VERY_LOW_USER_AMOUNT } from "database/constants/user-amounts";

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
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.MINES)
			.withAuthor(JiraUser.RALUCA_ARITON)
			.apply(),
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
		testDetails()
			.withTags(
				TestTag.SMOKE,
				JiraComponent.GAMDOM_ORIGINALS,
				JiraComponent.MINES,
			)
			.withAuthor(JiraUser.RALUCA_ARITON)
			.apply(),
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
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.MINES)
			.withAuthor(JiraUser.RALUCA_ARITON)
			.apply(),
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
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.MINES)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
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

	test(
		`[ENG-5847] Mines - Stop Autobet actuates immediately`,
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.MINES)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ minesGamePage, userBalanceHandler }) => {
			const minesBetDataForAutobet = new MinesBetTestData({
				betAmount: 10,
				minesNumber: 0,
				cashoutMultiplier: calculateMinesMultiplier({
					stepNumber: 1,
					mines: 1,
					houseEdge: 0.01,
				}),
			});

			const minesAutobetData = new MinesAutobetTestData({
				numberOfAutobetRounds: 0,
			});

			await minesGamePage.navigateAndWaitForGameToLoad();

			await minesGamePage
				.steps()
				.openAndConfigureAutobet(
					minesBetDataForAutobet,
					minesAutobetData.numberOfAutobetRounds,
				);

			const initialAccountBalance =
				await userBalanceHandler.walletBalanceInFiatRounded();

			await minesGamePage.steps().startAutobet();
			await minesGamePage.steps().stopAutobet();

			await minesGamePage.authenticatedHeader
				.assertThat()
				.accountBalanceHasChanged(initialAccountBalance);
		},
	);
});

test.describe.serial(
	"Mines - feature",
	testDetails().withTags(TestTag.SEQUENTIAL).apply(),
	() => {
		let superAdminCookie: string;

		test.beforeEach(async ({ gamdomApiDbFacade, gamdomApi, page }) => {
			const { cookie } =
				await gamdomApiDbFacade.createSuperAdminUserDbAndAuth({});
			superAdminCookie = getCookieHeader(cookie);

			await setAuthenticationCookies(page, cookie);

			await gamdomApi.setFeatureState(
				Feature.PLINKO,
				{
					[UserType.REGULAR]: false,
					[UserType.QA_USER]: false,
				},
				{ Cookie: superAdminCookie },
			);
		});

		test(
			"[ENG-5532] Mines game can be launched when Plinko is unavailable",
			testDetails()
				.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.MINES)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ minesGamePage, plinkoGamePage }) => {
				await plinkoGamePage.navigate();
				await plinkoGamePage.assertThat().plinkoIsDisabled();

				await minesGamePage.navigateAndWaitForGameToLoad();
				await minesGamePage
					.assertThat()
					.startPlayingButtonIsDisplayed();
			},
		);

		test.afterAll(async ({ gamdomApi }) => {
			await gamdomApi.setFeatureState(
				Feature.PLINKO,
				{
					[UserType.REGULAR]: true,
					[UserType.QA_USER]: true,
				},
				{ Cookie: superAdminCookie },
			);
		});
	},
);
