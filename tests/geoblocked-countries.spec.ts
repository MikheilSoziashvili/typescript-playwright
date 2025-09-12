import { USER_1_CREDENTIALS } from "@constants/credentials";
import { PRODUCTION_BASE_URL } from "@constants/page-urls";
import {
	AU_PROXY_CREDENTIALS,
	DE_PROXY_CREDENTIALS,
	DK_PROXY_CREDENTIALS,
	ES_PROXY_CREDENTIALS,
	NL_PROXY_CREDENTIALS,
	PT_PROXY_CREDENTIALS,
	UK_PROXY_CREDENTIALS,
	US_PROXY_CREDENTIALS,
	BE_PROXY_CREDENTIALS,
} from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import { ProxyCredentialsType } from "@core/types/types";
import {
	GeoblockedCountry,
	SoftBlockedCountry,
} from "@enums/geoblocked-countries";
import { JiraUser } from "@enums/jira/jira-users";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { test } from "@fixtures/fixtures";
import * as Configuration from "configuration";

const baseUrls = [PRODUCTION_BASE_URL, Configuration.environment_url];
const SOFTBLOCK_MODAL_TITLE =
	"Sorry, but Gamdom is not available in your jurisdiction.";

const countries = [
	GeoblockedCountry.UNITED_STATED,
	GeoblockedCountry.BELGIUM,
	GeoblockedCountry.NETHERLANDS,
];

const geoblockedCredentialsMap = new Map<string, ProxyCredentialsType>([
	[GeoblockedCountry.UNITED_STATED, US_PROXY_CREDENTIALS],
	[GeoblockedCountry.BELGIUM, BE_PROXY_CREDENTIALS],
	[GeoblockedCountry.NETHERLANDS, NL_PROXY_CREDENTIALS],
]);

const softBlockedCountries = [
	SoftBlockedCountry.DENMARK,
	SoftBlockedCountry.PORTUGAL,
	SoftBlockedCountry.UNITED_KINGDOM,
	SoftBlockedCountry.GERMANY,
	SoftBlockedCountry.SPAIN,
	SoftBlockedCountry.AUSTRALIA,
];

const softBlockedCredentialsMap = new Map<string, ProxyCredentialsType>([
	[SoftBlockedCountry.DENMARK, DK_PROXY_CREDENTIALS],
	[SoftBlockedCountry.PORTUGAL, PT_PROXY_CREDENTIALS],
	[SoftBlockedCountry.UNITED_KINGDOM, UK_PROXY_CREDENTIALS],
	[SoftBlockedCountry.GERMANY, DE_PROXY_CREDENTIALS],
	[SoftBlockedCountry.SPAIN, ES_PROXY_CREDENTIALS],
	[SoftBlockedCountry.AUSTRALIA, AU_PROXY_CREDENTIALS],
]);

for (const baseURL of baseUrls) {
	for (const country of countries) {
		test.describe(`Geoblocked country: ${country}`, () => {
			test.use({
				proxy: geoblockedCredentialsMap.get(country),
				baseURL: baseURL,
			});

			test(
				`[ENG-5596] Check the country-based access restrictions : Blocked in ${country} for URL ${baseURL}`,
				testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
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
for (const country of softBlockedCountries) {
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
				proxy: softBlockedCredentialsMap.get(country),
			});

			test(
				`[ENG-2621] Check the country-based access restrictions : Soft blocked in ${country}`,
				testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
				async ({ homePage, softblockModal }) => {
					await homePage.navigate();

					await softblockModal.assertThat().isDisplayed();

					await softblockModal
						.assertThat()
						.hasCorrectTitle(SOFTBLOCK_MODAL_TITLE);

					await softblockModal.steps().closeSoftblockModal();
					await softblockModal.assertThat().isNotDisplayed();

					await homePage.unauthenticatedHeader
						.assertThat()
						.isCreateAccountButtonDisabled();

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
