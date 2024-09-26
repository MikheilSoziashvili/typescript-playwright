import { test } from "@fixtures/fixtures";
import {
	BL_PROXY_CREDENTIALS,
	NL_PROXY_CREDENTIALS,
	US_PROXY_CREDENTIALS,
} from "@constants/proxies";
import { PRODUCTION_BASE_URL } from "@constants/page-urls";
import { GeoblockedCountry } from "@enums/geoblocked-countries";
import { ProxyCredentialsType } from "@core/types/types";

const countries = [
	GeoblockedCountry.UNITED_STATED,
	GeoblockedCountry.NETHERLANDS,
	GeoblockedCountry.BELARUS,
];
const geoblockedCredentialsMap = new Map<string, ProxyCredentialsType>([
	[GeoblockedCountry.UNITED_STATED, US_PROXY_CREDENTIALS],
	[GeoblockedCountry.NETHERLANDS, NL_PROXY_CREDENTIALS],
	[GeoblockedCountry.BELARUS, BL_PROXY_CREDENTIALS],
]);

for (const country of countries) {
	test.describe("Geoblocked countries tests", () => {
		test.fixme(country === GeoblockedCountry.BELARUS, "Check why proxy not working for BELARUS. Check when change providers if it works and delete this comment");
		test.use({
			proxy: geoblockedCredentialsMap.get(country),
			baseURL: PRODUCTION_BASE_URL,
		});
		test(`[ENG-289] Check the geoblock page : Geoblocked in ${country}`, async ({
			homePage,
			geoblockedPage,
		}) => {
			await homePage.tryNavigate({ retries: 5 });
			await geoblockedPage.assertThat().isGeoblockedErrorTitleDisplayed();
			await geoblockedPage
				.assertThat()
				.isBlockedCountryNameDisplayed(country);
		});
	});
}
