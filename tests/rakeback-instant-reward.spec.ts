import { test } from "@fixtures/fixtures";
import { DiceBetTestData } from "@dtos/test-data";
import { storageStateSuperadminAPI } from "@fixtures/auth-fixtures";
import { ToastTitle } from "@enums/toast-titles";
import { RatebackHouseEdge } from "@enums/rateback-house-edge-options";
import { buildClaimedAmountSubTitle } from "@core/helpers/asserter-helpers/text-asserters";

test.describe("Rakeback instant reward tests", () => {
	test.use(storageStateSuperadminAPI);
	test("[ENG-266] Rakeback instant reward", async ({
		homePage,
		diceGamePage,
		rewardsPage,
		rewardsExplorePage,
		toast,
	}) => {
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
		await rewardsPage.assertThat().isSpecialOfferPromotionNotInPrgress();
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
