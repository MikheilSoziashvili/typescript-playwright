import { PRODUCTION_BASE_URL } from "@constants/page-urls";
import { testDetails } from "@core/helpers/test-details-helper";
import { normalizeUrl } from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { OgProperties } from "@enums/playwright/htmlOgProperties";
import { OgPropertiesValues } from "@enums/playwright/htmlOgPropertiesValues";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import * as Configuration from "configuration";
import { isScheduledRun } from "configuration";

test.describe("Blog article - SEO meta tests", () => {
	test.use(storageStateNewUserDB());

	test(
		`[ENG-5680] Verify SEO meta information for Blog article`,
		testDetails()
			.withTags(JiraComponent.BLOG, JiraComponent.SEO)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.withJiraBugTickets("9597")
			.apply(),
		async ({ blogPage, blogPostPage }) => {
			test.fixme(isScheduledRun);

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
		},
	);
});
