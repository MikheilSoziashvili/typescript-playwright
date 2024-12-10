import { buildClaimedAmountSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { DiceBetTestData } from "@dtos/test-data";
import { RatebackHouseEdge } from "@enums/rateback-house-edge-options";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";

test.describe("Rakeback reward with special offers tests", () => {
	test("Obsolete functionality and test - Rakeback instant reward when special offer is in progress", async ({
		homePage,
		diceGamePage,
		rewardsPage,
		rewardsExplorePage,
		toast,
	}) => {
		test.fixme(
			true,
			"Rakeback instant reward is obsolete functionality. Replace with new test when the new feature is available on e2e-staging environment",
		);
		await rewardsPage.navigate();
		await rewardsPage
			.steps()
			.claimInstantRakebackReward({ claimAnyReward: true });

		const diceBetData = new DiceBetTestData({ betAmount: 100 });
		await diceGamePage.navigate();
		await diceGamePage.steps().rollDice(diceBetData);

		await rewardsExplorePage.navigate();
		await rewardsExplorePage.expandCurrentRoyaltyContainer();
		const instantRatebackByCurrentLevel =
			await rewardsExplorePage.getCurrentRoyaltyInstantRateback();

		const accountBalance =
			await rewardsExplorePage.authenticatedHeader.getAccountBalance();

		await rewardsPage.navigate();
		await rewardsPage.assertThat().isSpecialOfferPromotionInProgress();
		const ratebackAmount = await rewardsPage.calculateRatebackAmount({
			wager: diceBetData.betAmount,
			rateback: instantRatebackByCurrentLevel,
			houseEdge: RatebackHouseEdge.DICE_CUSTOM_GAMES,
		});

		await rewardsPage
			.steps()
			.claimInstantRakebackReward({ expectedAmount: ratebackAmount });

		await toast.assertThat().isDisplayed();
		await toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await toast
			.assertThat()
			.subTitleIs(buildClaimedAmountSubTitle(ratebackAmount));

		await homePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(accountBalance + ratebackAmount);
	});
});
