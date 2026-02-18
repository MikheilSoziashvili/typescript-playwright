import { DATASETS_DIR } from "@constants/file-paths";
import { GameToEndpointMap } from "@constants/game-endpoints";
import { testDetails } from "@core/helpers/test-details-helper";
import { parse_csv } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { LaunchLocation } from "@enums/homepage-launch-locations";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { environment_url } from "configuration";
import { testData } from "test-data/test-data-manager";

test.describe("Homepage navigation", () => {
	test.use(storageStateNewUserDB());

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
		test(
			`[ENG-3832] Homepage - verify '${casinoSlider.sliderButton}' button correct navigation to '${casinoSlider.sliderTitle}' page`,
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ homePage, casinoPage }) => {
				await homePage.navigateAndCheckTitle();
				await homePage
					.assertThat()
					.isCasinoGameSliderDisplayed(`${casinoSlider.sliderTitle}`);
				await homePage.clickOnCasinoGamesSliderVisitButton(
					`${casinoSlider.sliderTitle}`,
				);
				await casinoPage
					.assertThat()
					.waitForAndVerifyCurrentUrlIs(
						`${environment_url}${casinoSlider.urlEndpoint}`,
					);
				await casinoPage
					.assertThat()
					.isCasinoGamesScrollbarTabSelected(
						`${casinoSlider.casinoScrollbarTab}`,
					);
			},
		);
	});
});

test.describe(
	"[ENG-5798] Homepage - Originals Launch",
	testDetails().withTags(TestTag.ORIGINALS).apply(),
	() => {
		const originalsLaunchScenarios = testData().fromCsvRaw({
			file: CsvFilesName.HOMEPAGE_ORIGINALS_LAUNCH,
		});

		originalsLaunchScenarios.forEach((scenario) => {
			test(
				`[ENG-5798] should launch ${scenario.game} from ${scenario.location}`,
				testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ homePage }) => {
					await homePage.navigate();

					const expectedUrl = GameToEndpointMap[scenario.game];
					await homePage
						.steps()
						.clickOnOriginalsGameLaunchTile(
							scenario.game,
							scenario.location as LaunchLocation,
						);

					await homePage
						.assertThat()
						.originalsGameIsLaunched(scenario.game, expectedUrl);
				},
			);
		});
	},
);
