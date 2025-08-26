import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";

// NOTE: For Usain Bolt, Black Jack and Drop and wins slides should be implemented when ENG-1525 is fixed

test.describe("Homepage banner carousel", () => {
	test.use(storageStateNewUserDB());
	test(
		`[ENG-1158] - Homepage banner carousel - dice game page`,
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({ homePage, diceGamePage }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().isBannerCarouselDisplayed();
			await homePage
				.steps()
				.goToCarouselSlide(HomePageBannerCarouselSlideTitle.DICE_GAME);

			await diceGamePage.assertThat().pageElementsAreVisible();
		},
	);

	test(
		`[ENG-1158] - Homepage banner carousel - rewards page`,
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({ homePage, rewardsPage }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().isBannerCarouselDisplayed();
			await homePage
				.steps()
				.goToCarouselSlide(
					HomePageBannerCarouselSlideTitle.CLAIM_REWARDS,
				);

			await rewardsPage.assertThat().pageElementsAreVisible();
		},
	);

	test(
		`[ENG-1158] - Homepage banner carousel - esports page`,
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({ homePage, esportsPage }) => {
			test.fixme(
				true,
				"Slots battle page banner is not enabled on staging-for-e2e-tests environment",
			);
			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().isBannerCarouselDisplayed();
			await homePage
				.steps()
				.goToCarouselSlide(
					HomePageBannerCarouselSlideTitle.ESPORTS_BETTING,
				);

			await esportsPage.assertThat().pageElementsAreVisible();
		},
	);

	test(
		`[ENG-1158] - Homepage banner carousel - slots battle page`,
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({ homePage, slotsBattlePage }) => {
			test.fixme(
				true,
				"Slots battle page banner is not enabled on staging-for-e2e-tests environment",
			);
			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().isBannerCarouselDisplayed();
			await homePage
				.steps()
				.goToCarouselSlide(
					HomePageBannerCarouselSlideTitle.SLOT_BATTLES,
				);

			await slotsBattlePage.assertThat().pageElementsAreVisible();
		},
	);

	test(
		`[ENG-1158] - Homepage banner carousel - click banner from unauthenticated page`,
		testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
		async ({ homePage, profilePage }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().isBannerCarouselDisplayed();
			await profilePage.navigate();
			await profilePage.logout();

			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().isTopBannerDisplayed();
			await homePage.closeTopBanner();
			await homePage.clickCarouselActiveSlide();

			await homePage.loginModal
				.assertThat()
				.loginModalElementsAreVisible();
		},
	);
});
