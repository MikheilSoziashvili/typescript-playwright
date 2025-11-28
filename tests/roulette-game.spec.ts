import { RouletteBetColor, RouletteNumberColor } from "@enums/original-games";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle } from "@core/utils/utils";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";

test.describe("Roulette tests", () => {
	test.use(storageStateNewUserDB());
	test(
		"[ENG-264] Place a single bet on Roulette and try to win",
		testDetails()
			.withTags(TestTag.SMOKE, JiraComponent.GAMDOM_ORIGINALS)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async (
			{ rouletteGamePage, testDataObject, userBalanceHandler },
			testInfo,
		) => {
			test.slow(); // it takes some more time until a 'black' number is in
			const newUserDetails = getUserDetailsByTestTitle(
				testInfo.title,
				testInfo.workerIndex,
			);

			const betTestData = testDataObject.bet.default({
				username: newUserDetails.username,
			});
			await rouletteGamePage.navigate();

			let isWin: RouletteNumberColor = RouletteNumberColor.BLACK;
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
						RouletteBetColor.BLACK,
					);

				await rouletteGamePage.betOnColor(RouletteBetColor.BLACK);

				await rouletteGamePage
					.assertThat()
					.potentialBenefitValueIs(
						betTestData.betAmount,
						RouletteBetColor.BLACK,
						false,
					);

				await rouletteGamePage.assertThat().playersBetsDisplayed([
					{
						betColor: RouletteBetColor.BLACK,
						username: betTestData.username,
						betAmount: betTestData.betAmount,
					},
				]);

				await rouletteGamePage
					.assertThat()
					.totalBetsMatchesNumberOfBetRows(RouletteBetColor.BLACK);

				accountBalanceLeft =
					await userBalanceHandler.walletBalanceInFiatRounded();

				rouletteResultNumber =
					await rouletteGamePage.getRoundResultNumber();
				isWin = await rouletteGamePage.getRoundResultColor();

				logger.info(`Roulette result: ${RouletteNumberColor[isWin]}`);
			} while (isWin !== RouletteNumberColor.BLACK);

			//TODO: Animation for profit amount is too quick now, to investigate further how to handle it properly
			// await rouletteGamePage.assertThat().profitAmountDisplayed([
			// 	{
			// 		betColor: RouletteBetColor.BLACK,
			// 		username: betTestData.username,
			// 		betAmount: betTestData.betAmount,
			// 	},
			// ]);

			const expectedProfit = rouletteGamePage.calculateProfit(
				betTestData.betAmount,
				RouletteBetColor.BLACK,
			);
			await rouletteGamePage.authenticatedHeader
				.assertThat()
				.accountBalanceIs(accountBalanceLeft + expectedProfit);

			await rouletteGamePage
				.assertThat()
				.previousRollsHistoryUpdated(rouletteResultNumber);
		},
	);

	test(
		"[ENG-5847] Roulette - Stop Autobet actuates immediately",
		testDetails()
			.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.ROULETTE)
			.apply(),
		async ({ rouletteGamePage, testDataObject }, testInfo) => {
			const newUserDetails = getUserDetailsByTestTitle(
				testInfo.title,
				testInfo.workerIndex,
			);

			const betTestData = testDataObject.bet.build(
				{ username: newUserDetails.username },
				{ betAmount: 100 },
			);
			const stopIfBalanceIsOver = 1000000;

			await rouletteGamePage.navigate();
			await rouletteGamePage.waitBettingWindowAvailable();
			await rouletteGamePage.insertBet(betTestData.betAmount);

			await rouletteGamePage.expandAutobetSection();
			await rouletteGamePage.steps().startAutobet(stopIfBalanceIsOver);
			await rouletteGamePage.steps().stopAutobet();
		},
	);
});
