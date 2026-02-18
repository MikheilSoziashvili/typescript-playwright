import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

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
						.withTags(TestTag.ACCEPTANCE).apply(),
					async ({ homePage, gamdomApiDbFacade, page }) => {
						test.fixme(true, "Banners logic needs to be reworked");
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
			test(
				`[ENG-1158] - Homepage banner carousel - unauthenticated user`,
				testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ homePage }) => {
					test.fixme(true, "Banners logic needs to be reworked");
					await homePage.navigateAndCheckTitle();
					await homePage.assertThat().isTopBannerDisplayed();
				},
			);
		});
	},
);
