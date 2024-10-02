import { RouletteBetColor } from "@enums/original-games";
import { test } from "@fixtures/fixtures";
import { BetTestData, RegisterTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { calculateGreenHuntAmountByPercentage } from "@formulas/roulette";

const userCredentials = new RegisterTestData();
test.describe("Green hunt", () => {
	test.use(storageStateNewUserAPI({ username: userCredentials.username }));
	test("[ENG-1090] Roulette - green hunt @originals", async ({
		rouletteGamePage,
	}) => {
		const betTestData: BetTestData = new BetTestData(
			userCredentials.username,
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

		const accountBalance =
			await rouletteGamePage.authenticatedHeader.getAccountBalance();
		await rouletteGamePage.insertBet(betTestData.betAmount);
		await rouletteGamePage.assertThat().betButtonsEnabled();
		await rouletteGamePage.betOnColor(RouletteBetColor.RED);
		await rouletteGamePage
			.assertThat()
			.playerBetDisplayed(
				RouletteBetColor.RED,
				betTestData.username,
				betTestData.betAmount,
			);
		await rouletteGamePage
			.assertThat()
			.totalBetsAre(
				RouletteBetColor.GREEN,
				1,
				greenHuntAmountByPercentage,
			);
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
