import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";

const instantRewardsInputData = [
	{
		game: OriginalGame.Dice,
		betAmount: 3560,
		betType: 1.1,
		expectedReward: 1.78,
	},
	{
		game: OriginalGame.Crash,
		betAmount: 10000,
		betType: 1.1,
		expectedReward: 15,
	},
	{
		game: OriginalGame.Roulette,
		betAmount: 15000,
		betType: RouletteBetColor.GREEN,
		expectedReward: 22.5,
	},
	{
		game: OriginalGame.HiLo,
		betAmount: 30000,
		betType: HiloBetOption.BLACK,
		expectedReward: 45,
	},
];

instantRewardsInputData.forEach((inputData) => {
	test.describe("Instant reward tests", () => {
		test.slow();
		test.use(storageStateNewUserDB({ amount: 200000000 }));

		test(`[ENG-3679] Rewards - Instant reward - ${inputData.game} - Bet: ${inputData.betAmount}`, async ({
			originalsPage,
			rewardsPage,
		}) => {
			await originalsPage.navigateToGame(inputData.game);
			await originalsPage.placeBet(
				inputData.game,
				inputData.betAmount,
				inputData.betType,
			);
			await originalsPage.waitForGameRoundFinish(inputData.game);

			await rewardsPage.navigate();
			await rewardsPage
				.assertThat()
				.instantRewardVisibleAndCalculated(
					inputData.game,
					inputData.betAmount,
				);
			const accountBalanceInitial =
				await rewardsPage.authenticatedHeader.getAccountBalance();
			const roundedFinalBalance = parseFloat(
				(accountBalanceInitial + inputData.expectedReward).toFixed(2),
			);

			await rewardsPage
				.steps()
				.claimInstantRewardAndVerifyBalance(roundedFinalBalance);
		});
	});
});
