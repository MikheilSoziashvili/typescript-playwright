import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"Homepage banner carousel",
	testDetails().withTags(JiraComponent.HOMEPAGE).apply(),
	() => {
		const carouselBanners = testData().fromCsvRaw({
			file: CsvFilesName.HOME_PAGE_BANNER_CAROUSEL,
		});

		test.describe("Homepage banner carousel - logged in user", () => {
			carouselBanners.forEach((record) => {
				test(
					`[ENG-1158] - Homepage banner carousel - logged in user - ${record.bannerName} page contains src '${record.srcPartial}'`,
					testDetails()
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.withJiraBugTickets("8283")
						.apply(),
					async ({ homePage, gamdomApiDbFacade, page }) => {
						test.fixme(
							record.bannerName === "Drop & Wins Tournament" ||
								record.bannerName ===
									"Next-Gen Esports Betting",
							"Blog post is missing on e2e environment.",
						);
						const { cookie } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth();
						await setAuthenticationCookies(page, cookie);
						await homePage.navigateAndCheckTitle();
						await homePage.assertThat().isBannerCarouselDisplayed();
						await homePage
							.steps()
							.goToCarouselSlide(
								record.bannerName,
								record.srcPartial,
							);

						await homePage
							.assertThat()
							.waitForAndVerifyCurrentUrlIs(record.pageEndpoint);
					},
				);
			});
		});

		test.describe("Homepage banner carousel - unauthenticated user", () => {
			carouselBanners.forEach((record) => {
				test(
					`[ENG-1158] - Homepage banner carousel - unauthenticated user - ${record.bannerName} page contains src '${record.srcPartial}'`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
					async ({ homePage }) => {
						await homePage.navigateAndCheckTitle();
						await homePage.assertThat().isTopBannerDisplayed();
						await homePage.closeTopBanner();
						await homePage.assertThat().isBannerCarouselDisplayed();
						await homePage
							.steps()
							.goToCarouselSlide(
								record.bannerName,
								record.srcPartial,
							);

						await homePage.loginModal
							.assertThat()
							.loginModalElementsAreVisible();
					},
				);
			});
		});
	},
);
