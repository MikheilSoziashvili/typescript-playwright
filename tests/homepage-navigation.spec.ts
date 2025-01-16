import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { parse_csv } from "@core/utils/utils";
import { DATASETS_DIR } from "@constants/file-paths";
import { CsvFilesName } from "@enums/csv-file-name";
import { environment_url } from "configuration";

test.describe("Homepage navigation", () => {
	test.use(storageStateNewUserAPI());

	const casinoSliders = parse_csv(
		DATASETS_DIR,
		CsvFilesName.HOME_PAGE_CASINO_SLIDER_NAVIGATION,
	) as {
		sliderButton: string;
		urlEndpoint: string;
		casinoScrollbarTab: string;
		sliderTitle: string;
	}[];

	casinoSliders.forEach((casinoSlider) => {
		test(`[ENG-3832] Homepage - verify '${casinoSlider.sliderButton}' button correct navigation to '${casinoSlider.sliderTitle}' page`, async ({
			homePage,
			casinoPage,
		}) => {
			await homePage.navigateAndCheckTitle();
			await homePage
				.assertThat()
				.isCasinoGameSliderDisplayed(`${casinoSlider.sliderTitle}`);
			await homePage.clickOnCasinoGamesSliderVisitButton(
				`${casinoSlider.sliderButton}`,
			);
			await casinoPage
				.assertThat()
				.verifyCurrentUrlIs(
					`${environment_url}${casinoSlider.urlEndpoint}`,
				);
			await casinoPage
				.assertThat()
				.isCasinoGamesScrollbarTabSelected(
					`${casinoSlider.casinoScrollbarTab}`,
				);
		});
	});
});
