import { test } from "../../fixtures/fixtures";
import { NL_PROXY_CREDENTIALS } from "../../constants/proxies";
import { PRODUCTION_BASE_URL } from "../../constants/page-urls";
import { GeoblockedCountries } from "../../enums/geoblocked-countries";

test.describe("Geoblocked countries tests", () => {
	test.use({
		proxy: NL_PROXY_CREDENTIALS,
		baseURL: PRODUCTION_BASE_URL,
	});
	test("[QA-396] Geoblocked in NL", async ({ homePage, geoblockedPage }) => {
		await homePage.tryNavigate({ retries: 5 });
		await geoblockedPage.assertThat().isGeoblockedErrorTitleDisplayed();
		await geoblockedPage
			.assertThat()
			.isBlockedCountryNameDisplayed(GeoblockedCountries.NETHERLANDS);
	});
});
