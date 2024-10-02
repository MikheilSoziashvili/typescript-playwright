import { RouletteBetColor, RouletteNumberColor } from "@enums/original-games";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { BetTestData, RegisterTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";

const userCredentials = new RegisterTestData();
test.describe("Roulette tests", () => {
	test.use(storageStateNewUserAPI({ username: userCredentials.username }));
	test("[ENG-264] Place a single bet on Roulette and try to win @smoke @originals", async ({
		rouletteGamePage,
	}) => {
		test.slow(); // it takes some more time until a 'red' number is in

		const betTestData: BetTestData = new BetTestData(
			userCredentials.username,
			1,
			1,
		);
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
					RouletteBetColor.RED,
				);

			await rouletteGamePage.betOnColor(RouletteBetColor.RED);

			await rouletteGamePage
				.assertThat()
				.potentialBenefitValueIs(
					betTestData.betAmount,
					RouletteBetColor.RED,
					false,
				);
			await rouletteGamePage
				.assertThat()
				.playerBetDisplayed(
					RouletteBetColor.RED,
					betTestData.username,
					betTestData.betAmount,
				);

			await rouletteGamePage
				.assertThat()
				.totalBetsAre(RouletteBetColor.RED, 1, 1);

			accountBalanceLeft =
				await rouletteGamePage.authenticatedHeader.getAccountBalance();

			rouletteResultNumber =
				await rouletteGamePage.getRoundResultNumber();
			isWin = await rouletteGamePage.getRoundResultColor();

			logger.info(`Roulette result: ${RouletteNumberColor[isWin]}`);
		} while (isWin !== RouletteNumberColor.RED);

		await rouletteGamePage
			.assertThat()
			.profitAmountDisplayed(RouletteBetColor.RED, betTestData.betAmount);

		const expectedProfit = rouletteGamePage.calculateProfit(
			betTestData.betAmount,
			RouletteBetColor.RED,
		);
		await rouletteGamePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(accountBalanceLeft + expectedProfit);

		await rouletteGamePage
			.assertThat()
			.previousRollsHistoryUpdated(rouletteResultNumber);
	});
});
