import { PRODUCTION_BASE_URL } from "@constants/page-urls";
import { normalizeUrl } from "@core/utils/utils";
import { OgProperties } from "@enums/playwright/htmlOgProperties";
import { OgPropertiesValues } from "@enums/playwright/htmlOgPropertiesValues";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import * as Configuration from "configuration";

test.describe("Blog article - SEO meta tests", () => {
	test.use(storageStateNewUserAPI());

	test(`[ENG-5680] Verify SEO meta information for Blog article`, async ({
		blogPage,
		blogPostPage,
	}) => {
		await blogPage.navigate();
		await blogPage.clickViewArticleButton();
		await blogPostPage.refresh();
		const blogPostTitle = await blogPostPage.getBlogPostArticleTitle();
		const blogPostSubTitle =
			await blogPostPage.getBlogPostArticleSubTitle();
		const blogPostUrl = normalizeUrl(
			blogPostPage.page
				.url()
				.toString()
				.replace(
					`${Configuration.environment_url}`,
					`${PRODUCTION_BASE_URL}`,
				),
		);
		await blogPage
			.assertThat()
			.verifyOgPropertiesValues(
				[
					OgProperties.OG_TITLE,
					OgProperties.OG_DESCRIPTION,
					OgProperties.OG_TYPE,
					OgProperties.OG_URL,
				],
				[
					blogPostTitle,
					blogPostSubTitle,
					OgPropertiesValues.OG_TYPE,
					blogPostUrl,
				],
			);
	});
});
