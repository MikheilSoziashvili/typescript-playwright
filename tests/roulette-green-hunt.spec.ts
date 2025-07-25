import { RouletteBetColor } from "@enums/original-games";
import { test } from "@fixtures/fixtures";
import { BetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { calculateGreenHuntAmountByPercentage } from "@formulas/roulette";
import { getUserDetailsByTestTitle } from "@core/utils/utils";

test.describe("Green hunt", () => {
	test.use(storageStateNewUserDB());
	test("[ENG-1090] Roulette - green hunt @originals", async ({
		rouletteGamePage,
		userBalanceHandler,
	}, testInfo) => {
		const newUserDetails = getUserDetailsByTestTitle(
			testInfo.title,
			testInfo.workerIndex,
		);
		const betTestData: BetTestData = new BetTestData(
			newUserDetails.username,
			100,
			1,
		);
		const greenHuntPercentage = 50;
		await rouletteGamePage.navigate();
		await rouletteGamePage.waitBettingWindowAvailable();

		await rouletteGamePage
			.steps()
			.startGreenHunt(greenHuntPercentage, GreenHuntTypeOption.PERCENT);
		const greenHuntAmountByPercentage =
			calculateGreenHuntAmountByPercentage(
				betTestData.betAmount,
				greenHuntPercentage,
			);

		const accountBalance = await userBalanceHandler.walletBalanceInUsd();
		await rouletteGamePage.insertBet(betTestData.betAmount);
		await rouletteGamePage.assertThat().betButtonsEnabled();
		await rouletteGamePage.betOnColor(RouletteBetColor.RED);
		await rouletteGamePage.assertThat().playersBetsDisplayed([
			{
				betColor: RouletteBetColor.RED,
				username: betTestData.username,
				betAmount: betTestData.betAmount,
			},
		]);
		await rouletteGamePage
			.assertThat()
			.totalBetsAre(RouletteBetColor.GREEN);
		await rouletteGamePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(
				accountBalance -
					betTestData.betAmount -
					greenHuntAmountByPercentage,
			);
		const rouletteResultNumber =
			await rouletteGamePage.getRoundResultNumber();
		await rouletteGamePage
			.assertThat()
			.previousRollsHistoryUpdated(rouletteResultNumber);
	});
});
