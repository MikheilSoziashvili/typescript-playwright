import { RouletteBetColor, RouletteNumberColor } from "@enums/original-games";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { BetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { getUserDetailsByTestTitle } from "@core/utils/utils";

test.describe("Roulette tests", () => {
	test.use(storageStateNewUserDB());
	test("[ENG-264] Place a single bet on Roulette and try to win @smoke @originals", async ({
		rouletteGamePage,
	}, testInfo) => {
		test.slow(); // it takes some more time until a 'black' number is in
		const newUserDetails = getUserDetailsByTestTitle(
			testInfo.title,
			testInfo.workerIndex,
		);
		const betTestData: BetTestData = new BetTestData(
			newUserDetails.username,
			1,
			1,
		);
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

			await rouletteGamePage
				.assertThat()
				.playersBetsDisplayed([
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
				await rouletteGamePage.authenticatedHeader.getAccountBalance();

			rouletteResultNumber =
				await rouletteGamePage.getRoundResultNumber();
			isWin = await rouletteGamePage.getRoundResultColor();

			logger.info(`Roulette result: ${RouletteNumberColor[isWin]}`);
		} while (isWin !== RouletteNumberColor.BLACK);

		await rouletteGamePage
			.assertThat()
			.profitAmountDisplayed([
                {
                    betColor: RouletteBetColor.BLACK,
                    username: betTestData.username,
                    betAmount: betTestData.betAmount,
                },
            ]);

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
	});
});
