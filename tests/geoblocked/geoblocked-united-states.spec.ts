import { test } from "../../fixtures/fixtures";
import { US_PROXY_CREDENTIALS } from "../../constants/proxies";
import { PRODUCTION_BASE_URL } from "../../constants/page-urls";
import { GeoblockedCountries } from "../../enums/geoblocked-countries";

test.describe("Geoblocked countries tests", () => {
	test.use({
		proxy: US_PROXY_CREDENTIALS,
		baseURL: PRODUCTION_BASE_URL,
	});
	test("[QA-391] Geoblocked in US", async ({ homePage, geoblockedPage }) => {
		await homePage.tryNavigate({ retries: 5 });
		await geoblockedPage.assertThat().isGeoblockedErrorTitleDisplayed();
		await geoblockedPage
			.assertThat()
			.isBlockedCountryNameDisplayed(GeoblockedCountries.UNITED_STATED);
	});
});
