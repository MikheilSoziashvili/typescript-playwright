import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe("Blog - social share links tests", () => {
	testData()
		.fromCsvParsed({ file: CsvFilesName.BLOG_VERIFY_SOCIAL_SHARE_LINKS })
		.forEach((input) => {
			test(
				`[ENG-6374][Blog] Verify the social share links - ${input.socialMedia}`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
				async ({ blogPage, blogPostPage, gamdomApiDbFacade, page }) => {
					const { cookie } =
						await gamdomApiDbFacade.createSingleUserDbAndAuth();

					await setAuthenticationCookies(page, cookie);
					await blogPage.navigate();
					await blogPage.clickViewArticleButton();

					await blogPostPage.clickShareButton(input.socialMedia);
					await blogPostPage
						.assertThat()
						.verifyNewTabUrlParts([
							input.socialMediaUrlPart,
							input.gamdomUrlPart,
						]);
				},
			);
		});
});
