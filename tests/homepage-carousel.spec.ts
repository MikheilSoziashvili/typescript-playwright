import { test } from "@fixtures/fixtures";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { USER_1_CREDENTIALS } from "@constants/credentials";

// NOTE: For Usain Bolt, Black Jack and Drop and wins slides should be implemented when ENG-1525 is fixed

test.describe("Homepage banner carousel", () => {
	test.use(storageStateUserAPI(USER_1_CREDENTIALS.username));
	test(`[ENG-1158] - Homepage banner carousel - dice game page`, async ({
		homePage,
		diceGamePage,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().isBannerCarouselDisplayed();
		await homePage
			.steps()
			.goToCarouselSlide(HomePageBannerCarouselSlideTitle.DICE_GAME);

		await diceGamePage.assertThat().pageElementsAreVisible();
	});

	test(`[ENG-1158] - Homepage banner carousel - rewards page`, async ({
		homePage,
		rewardsPage,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().isBannerCarouselDisplayed();
		await homePage
			.steps()
			.goToCarouselSlide(HomePageBannerCarouselSlideTitle.CLAIM_REWARDS);

		await rewardsPage.assertThat().pageElementsAreVisible();
	});

	// FIXME: E-sports page banner is not enabled on staging-for-e2e-tests environment
	test.fixme(`[ENG-1158] - Homepage banner carousel - esports page`, async ({
		homePage,
		esportsPage,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().isBannerCarouselDisplayed();
		await homePage
			.steps()
			.goToCarouselSlide(
				HomePageBannerCarouselSlideTitle.ESPORTS_BETTING,
			);

		await esportsPage.assertThat().pageElementsAreVisible();
	});

	// FIXME: Slots battle page banner is not enabled on staging-for-e2e-tests environment
	test.fixme(`[ENG-1158] - Homepage banner carousel - slots battle page`, async ({
		homePage,
		slotsBattlePage,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().isBannerCarouselDisplayed();
		await homePage
			.steps()
			.goToCarouselSlide(HomePageBannerCarouselSlideTitle.SLOT_BATTLES);

		await slotsBattlePage.assertThat().pageElementsAreVisible();
	});

	test(`[ENG-1158] - Homepage banner carousel - click banner from unauthenticated page`, async ({
		homePage,
		profilePage,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().isBannerCarouselDisplayed();
		await profilePage.navigate();
		await profilePage.logout();

		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().isTopBannerDisplayed();
		await homePage.closeTopBanner();
		await homePage.clickCarouselActiveSlide();

		await homePage.loginModal.assertThat().loginModalElementsAreVisible();
	});
});
