import { test } from "../fixtures/fixtures";
import { DiceBetTestData } from "../dtos/test-data";
import { storageStateSuperadmin } from "../fixtures/auth-fixtures";
import { ToastTitles } from "../enums/toast-titles";
import { RatebackHouseEdge } from "../enums/rateback-house-edge-options";

test.describe("Rakeback instant reward tests", () => {
	test.use(storageStateSuperadmin);
	test("[ENG-266] Rakeback instant reward @smoke", async ({
		homePage,
		diceGamePage,
		rewardsPage,
		rewardsExplorePage,
		toast,
	}) => {
		const diceBetAmount = "100.00";
		const diceBetData = new DiceBetTestData(parseFloat(diceBetAmount));
		await diceGamePage.navigate();
		await diceGamePage.steps().rollDice(diceBetData);

		await rewardsExplorePage.navigate();
		await rewardsExplorePage.expandCurrentRoyaltyContainer();
		const instantRatebackByCurrentLevel =
			await rewardsExplorePage.getCurrentRoyaltyInstantRateback();

		const accountBalance = await homePage.getAccountBalance();

		await rewardsPage.navigate();
		await rewardsPage.assertThat().isSpecialOfferPromotionNotInPrgress();
		const ratebackAmount = await rewardsPage.calculateRatebackAmount({
			wager: diceBetAmount,
			rateback: instantRatebackByCurrentLevel,
			houseEdge: RatebackHouseEdge.DICE_CUSTOM_GAMES,
		});

		await rewardsPage.steps().claimInstantRakebackReward(ratebackAmount);

		await toast.assertThat().isDisplayed();
		await toast.assertThat().titleIs(ToastTitles.SUCCESS);
		await toast
			.assertThat()
			.subTitleIs(`You have successfully claimed $${ratebackAmount}!`);

		await homePage
			.assertThat()
			.accountBalanceIs(accountBalance + parseFloat(ratebackAmount));
	});
});
