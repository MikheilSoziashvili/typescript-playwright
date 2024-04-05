import { test } from "../../fixtures/fixtures";
import { BL_PROXY_CREDENTIALS } from "../../constants/proxies";
import { PRODUCTION_BASE_URL } from "../../constants/page-urls";
import { GeoblockedCountries } from "../../enums/geoblocked-countries";

// TODO: Check why proxy not working. Check when change providers if it works and delete this comment
test.describe("Geoblocked countries tests", () => {
	test.use({
		proxy: BL_PROXY_CREDENTIALS,
		baseURL: PRODUCTION_BASE_URL,
	});
	test("[QA-397] Geoblocked in BL", async ({ homePage, geoblockedPage }) => {
		await homePage.tryNavigate({ retries: 5 });
		await geoblockedPage.assertThat().isGeoblockedErrorTitleDisplayed();
		await geoblockedPage
			.assertThat()
			.isBlockedCountryNameDisplayed(GeoblockedCountries.BELARUS);
	});
});
