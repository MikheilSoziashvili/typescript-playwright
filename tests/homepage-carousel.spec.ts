import { testDetails } from "@core/helpers/test-details-helper";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraUser } from "@enums/jira/jira-users";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe("Homepage banner carousel", () => {
	const carouselBanners = testData().fromCsvRaw({
		file: CsvFilesName.HOME_PAGE_BANNER_CAROUSEL,
	});

	test.describe("Homepage banner carousel - logged in user", () => {
		test.use(storageStateNewUserDB());
		carouselBanners.forEach((record) => {
			test(
				`[ENG-1158] - Homepage banner carousel - logged in user - ${record.bannerName} page contains src '${record.srcPartial}'`,
				testDetails()
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.withJiraBugTickets("8931")
					.apply(),
				async ({ homePage }) => {
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
				testDetails()
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.withJiraBugTickets("8931")
					.apply(),
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
});
