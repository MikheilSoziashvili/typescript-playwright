import { USER_1_CREDENTIALS } from "@constants/credentials";
import { PRODUCTION_BASE_URL } from "@constants/page-urls";
import { testDetails } from "@core/helpers/test-details-helper";
import { SoftBlockedCountry } from "@enums/geoblocked-countries";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { test } from "@fixtures/fixtures";
import * as Configuration from "configuration";
import { OAuthExpectations } from "test-data/interfaces";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

const baseUrls = [PRODUCTION_BASE_URL, Configuration.environment_url];
const SOFTBLOCK_MODAL_TITLE =
	"Sorry, but Gamdom is not available in your jurisdiction.";

const geoblockTestDataDomain = testData().fromDomain().oAuthLogin;

for (const baseURL of baseUrls) {
	for (const country of geoblockTestDataDomain.countries) {
		test.describe(`Geoblocked country: ${country}`, () => {
			test.use({
				proxy: geoblockTestDataDomain.geoblockedCredentialsMap.get(
					country,
				),
				baseURL: baseURL,
			});

			test(
				`[ENG-5596] Check the country-based access restrictions : Blocked in ${country} for URL ${baseURL}`,
				testDetails()
					.withAuthor(JiraUser.RALUCA_ARITON)
					.withTags(JiraComponent.GEOBLOCK, TestTag.ACCEPTANCE)
					.apply(),
				async ({ homePage, geoblockedPage }) => {
					await homePage.tryNavigate({ retries: 5 });
					await geoblockedPage
						.assertThat()
						.isGeoblockedErrorTitleDisplayed();
					await geoblockedPage
						.assertThat()
						.isBlockedCountryNameDisplayed(country);
				},
			);
		});
	}
}

/* Skipping softblocked countries due to current proxy limitations:
- AU: too far, site not loading
- UK - Disabled from soft blocked countries as the CI runners are in the UK
- PT - Disabled from soft blocked countries for e2e-stg env due to use the proxy for other test needs.
Unskip once proxies are stable or replaced.*/
for (const country of geoblockTestDataDomain.softBlockedCountries) {
	test.describe(
		`Soft blocked country: ${country}`,
		testDetails()
			.withArbitraryAnnotations({
				type: AnnotationType.INFRASTRUCTURE,
				description: `Skipped softblocked countries (AU, UK, PT) due to current proxy limitations.`,
			})
			.apply(),
		() => {
			test.fixme(
				country === SoftBlockedCountry.UNITED_KINGDOM ||
					country === SoftBlockedCountry.AUSTRALIA ||
					country === SoftBlockedCountry.PORTUGAL,
			);
			test.use({
				proxy: geoblockTestDataDomain.softBlockedCredentialsMap.get(
					country,
				),
			});

			test(
				`[ENG-2621] Check the country-based access restrictions : Soft blocked in ${country}`,
				testDetails()
					.withAuthor(JiraUser.RALUCA_ARITON)
					.withTags(JiraComponent.GEOBLOCK, TestTag.ACCEPTANCE)
					.apply(),
				async ({ homePage, softblockModal }) => {
					await homePage.navigate();

					await softblockModal.assertThat().isDisplayed();

					await softblockModal
						.assertThat()
						.hasCorrectTitle(SOFTBLOCK_MODAL_TITLE);

					await softblockModal.steps().closeSoftblockModal();
					await softblockModal.assertThat().isNotDisplayed();

					await homePage.unauthenticatedHeader
						.steps()
						.clickCreateAccountAndVerifyJurisdictionToast();

					await homePage.assertThat().verifyTopBannerButtonsState();

					await homePage
						.steps()
						.loginUser(
							USER_1_CREDENTIALS.username,
							USER_1_CREDENTIALS.password,
						);
				},
			);
		},
	);
}

for (const country of geoblockTestDataDomain.softBlockedWithoutLoginCountries) {
	test.describe(`Soft blocked country: ${country} (login not available)`, () => {
		test.use({
			proxy: geoblockTestDataDomain.softBlockedCredentialsMap.get(
				SoftBlockedCountry.SLOVAKIA,
			),
		});

		test(
			"[ENG-5905] Soft blocked behavior for SK (no login allowed)",
			testDetails()
				.withAuthor(JiraUser.RALUCA_ARITON)
				.withTags(JiraComponent.GEOBLOCK, TestTag.ACCEPTANCE)
				.apply(),
			async ({ homePage, softblockModal }) => {
				await homePage.navigate();

				await softblockModal.assertThat().isDisplayed();
				await softblockModal
					.assertThat()
					.hasCorrectTitle(SOFTBLOCK_MODAL_TITLE);

				await softblockModal.steps().closeSoftblockModal();
				await softblockModal.assertThat().isNotDisplayed();

				await homePage.unauthenticatedHeader
					.steps()
					.clickCreateAccountAndVerifyJurisdictionToast();

				await homePage.unauthenticatedHeader
					.assertThat()
					.isSignInButtonDisabled();

				await homePage.assertThat().verifyTopBannerButtonsState();
			},
		);
	});
}

for (const country of geoblockTestDataDomain.softBlockedCountries) {
	test.describe(
		`OAuth restrictions for ${country}`,
		testDetails()
			.withArbitraryAnnotations({
				type: AnnotationType.INFRASTRUCTURE,
				description: `Skipped softblocked countries (AU, UK, PT) due to current proxy limitations.`,
			})
			.apply(),
		() => {
			test.fixme(
				country === SoftBlockedCountry.UNITED_KINGDOM ||
					country === SoftBlockedCountry.AUSTRALIA ||
					country === SoftBlockedCountry.PORTUGAL,
			);
			const oAuthTestDataDomain = testData().fromDomain().oAuthLogin;

			const scenario = oAuthTestDataDomain.oAuthScenarios.find(
				(s) => s.country === country,
			);

			const expects: OAuthExpectations = scenario
				? scenario.expectations
				: { steam: true, google: true, telegram: true };

			test.use({
				proxy: oAuthTestDataDomain.softBlockedCredentialsMap.get(
					country,
				),
			});

			test(
				`[ENG-5914] Verify OAuth restriction rules for ${country}`,
				testDetails()
					.withAuthor(JiraUser.RALUCA_ARITON)
					.withTags(JiraComponent.GEOBLOCK, TestTag.ACCEPTANCE)
					.apply(),
				async ({ homePage, softblockModal }) => {
					await homePage.navigate();

					await softblockModal.assertThat().isDisplayed();
					await softblockModal
						.assertThat()
						.hasCorrectTitle(SOFTBLOCK_MODAL_TITLE);

					await softblockModal.steps().closeSoftblockModal();
					await softblockModal.assertThat().isNotDisplayed();

					await homePage.unauthenticatedHeader.openLoginModal();

					await homePage.unauthenticatedHeader
						.assertThat()
						.oAuthButtonsMatch(expects);
				},
			);
		},
	);
}
