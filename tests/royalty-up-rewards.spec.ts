import { buildRewardsRoyaltyUpRankSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";

// TODO: Add additional test data for different games and bet types when rewards calculation is defined.
const rewardsInputData = [
	{
		tipUserAmount: SUPER_HIGH_USER_AMOUNT,
		game: OriginalGame.Dice,
		betAmount: 200000,
		betType: 1.1,
		expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_3,
			RewardsRoyaltyUpRanks.SILVER_1,
			RewardsRoyaltyUpRanks.SILVER_2,
			RewardsRoyaltyUpRanks.SILVER_3,
			RewardsRoyaltyUpRanks.GOLD_1,
		],
		expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
	},
	{
		tipUserAmount: SUPER_HIGH_USER_AMOUNT,
		game: OriginalGame.Crash,
		betAmount: 50000,
		betType: 1.1,
		expectedRankToast: RewardsRoyaltyUpRanks.SILVER_3,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_3,
			RewardsRoyaltyUpRanks.SILVER_1,
			RewardsRoyaltyUpRanks.SILVER_2,
			RewardsRoyaltyUpRanks.SILVER_3,
		],
		expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_1,
	},
	{
		tipUserAmount: SUPER_HIGH_USER_AMOUNT,
		game: OriginalGame.Roulette,
		betAmount: 70000,
		betType: RouletteBetColor.BLACK,
		expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_3,
			RewardsRoyaltyUpRanks.SILVER_1,
			RewardsRoyaltyUpRanks.SILVER_2,
			RewardsRoyaltyUpRanks.SILVER_3,
			RewardsRoyaltyUpRanks.GOLD_1,
		],
		expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
	},
	{
		tipUserAmount: SUPER_HIGH_USER_AMOUNT,
		game: OriginalGame.HiLo,
		betAmount: 70000,
		betType: HiloBetOption.BLACK,
		expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_3,
			RewardsRoyaltyUpRanks.SILVER_1,
			RewardsRoyaltyUpRanks.SILVER_2,
			RewardsRoyaltyUpRanks.SILVER_3,
			RewardsRoyaltyUpRanks.GOLD_1,
		],
		expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
	},
];

rewardsInputData.forEach((inputData) => {
	test.describe("Rewards - Royalty Up tests", () => {
		test.use(
			storageStateNewUserDB({
				amount: inputData.tipUserAmount,
				emailVerified: true,
			}),
		);

		test(
			`[ENG-3712] Verify in-progress rank gain for '${inputData.game}' Originals game with '${inputData.betAmount}' bet, expected rank '${inputData.expectedInProgressRanks}', and claim all Royalty-Up rewards`,
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ rewardsPage, toast, originalsPage }) => {
				test.fixme(
					true,
					"Temporary skipped until test cases are adjusted to use casino games, then the automation code will be adjusted to align",
				);
				test.slow();

				await originalsPage.navigateToGame(inputData.game);
				await originalsPage.placeBet(
					inputData.game,
					inputData.betAmount,
					inputData.betType,
				);

				await toast.assertThat().isDisplayed();
				await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
					subTitle: buildRewardsRoyaltyUpRankSubTitle(
						inputData.expectedRankToast,
					),
				});

				await originalsPage.waitForGameRoundFinish(inputData.game);

				await rewardsPage.navigate();
				await rewardsPage
					.assertThat()
					.isRoyaltyUpRewardsClaimable(
						inputData.expectedClaimableRanks,
					);

				await rewardsPage.claimRoyaltyUpReward(
					inputData.expectedClaimableRanks,
				);

				await rewardsPage
					.assertThat()
					.isRoyaltyUpRewardsInProgress(
						inputData.expectedInProgressRanks,
					);
			},
		);
	});
});
