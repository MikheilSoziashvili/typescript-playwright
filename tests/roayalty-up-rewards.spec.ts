import { buildRewardsRoyaltyUpRankSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { generateEmailAndInbox } from "@core/utils/utils";
import { MAILINATOR_DOMAIN } from "@constants/domains";
import { OriginalGame, RouletteBetColor } from "@enums/original-games";
import { HiloBetOption } from "@enums/hilo-bet-options";

// TODO: Add additional test data for different games and bet types when rewards calculation is defined.
const rewardsInputData = [
	{
		tipUserAmount: 1500000000,
		game: OriginalGame.Dice,
		betAmount: 400000,
		betType: 1.1,
		expectedRankToast: RewardsRoyaltyUpRanks.SILVER_1,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_1,
			RewardsRoyaltyUpRanks.BRONZE_2,
			RewardsRoyaltyUpRanks.BRONZE_3,
			RewardsRoyaltyUpRanks.SILVER_1,
		],
		expectedInProgressRanks: RewardsRoyaltyUpRanks.SILVER_2,
	},
	{
		tipUserAmount: 1500000000,
		game: OriginalGame.Crash,
		betAmount: 500000,
		betType: 1.1,
		expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_1,
			RewardsRoyaltyUpRanks.BRONZE_2,
			RewardsRoyaltyUpRanks.BRONZE_3,
			RewardsRoyaltyUpRanks.SILVER_1,
			RewardsRoyaltyUpRanks.SILVER_2,
			RewardsRoyaltyUpRanks.SILVER_3,
			RewardsRoyaltyUpRanks.GOLD_1,
		],
		expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
	},
	{
		tipUserAmount: 1500000000,
		game: OriginalGame.Roulette,
		betAmount: 600000,
		betType: RouletteBetColor.BLACK,
		expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_1,
			RewardsRoyaltyUpRanks.BRONZE_2,
			RewardsRoyaltyUpRanks.BRONZE_3,
			RewardsRoyaltyUpRanks.SILVER_1,
			RewardsRoyaltyUpRanks.SILVER_2,
			RewardsRoyaltyUpRanks.SILVER_3,
			RewardsRoyaltyUpRanks.GOLD_1,
		],
		expectedInProgressRanks: RewardsRoyaltyUpRanks.GOLD_2,
	},
	{
		tipUserAmount: 1500000000,
		game: OriginalGame.HiLo,
		betAmount: 500000,
		betType: HiloBetOption.BLACK,
		expectedRankToast: RewardsRoyaltyUpRanks.GOLD_1,
		expectedClaimableRanks: [
			RewardsRoyaltyUpRanks.BRONZE_1,
			RewardsRoyaltyUpRanks.BRONZE_2,
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
		const { email, inbox } = generateEmailAndInbox();
		test.use(
			storageStateNewUserAPI({
				amount: inputData.tipUserAmount,
				email: email,
			}),
		);

		test(`[ENG-3712] Verify in-progress rank gain for '${inputData.game}' Originals game with '${inputData.betAmount}' bet, expected rank '${inputData.expectedInProgressRanks}', and claim all Royalty-Up rewards`, async ({
			rewardsPage,
			toast,
			page,
			profilePage,
			mailinatorApi,
			originalsPage,
		}) => {
			test.slow();
			await profilePage
				.steps()
				.verifyEmail(mailinatorApi, MAILINATOR_DOMAIN, inbox, page);

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
				.isRoyaltyUpRewardsClaimable(inputData.expectedClaimableRanks);

			await rewardsPage.claimRoyaltyUpReward(
				inputData.expectedClaimableRanks,
			);

			await rewardsPage
				.assertThat()
				.isRoyaltyUpRewardsInProgress(
					inputData.expectedInProgressRanks,
				);
		});
	});
});
