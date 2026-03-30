import { testDetails } from "@core/helpers/test-details-helper";
import { generateCustomUrl } from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Sports blog tests",
	testDetails()
		.withTags(JiraComponent.BLOG, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test(
			`[ENG-7656] Sports Blog - Article creation`,
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				browserSessionManager,
				testDataObject,
				testDataPredefinedRandom,
			}) => {
				const sportsBlogAdmin = await browserSessionManager.loginAs(
					TestUserRole.ADMIN_SPORTS_BLOG_ADMIN,
					{
						reuseContext: true,
					},
				);

				const { articleName, articleSubtitle } =
					testDataPredefinedRandom.data.sportsBlog;

				const articleTestData = testDataObject.blogArticle.build({
					title: articleName,
					customUrl: generateCustomUrl(articleName),
					subtitle: articleSubtitle,
					author: sportsBlogAdmin.getAuthenticatedUser().user
						.username,
				});

				await sportsBlogAdmin.pages.sportsBlogPage.navigate();
				await sportsBlogAdmin.pages.sportsBlogPage.clickCreateNewArticleButton();
				await sportsBlogAdmin.pages.sportsBlogModal.fillSportsBlogArticleSuccessfully(
					articleTestData,
				);
				await sportsBlogAdmin.pages.toast
					.assertThat()
					.toastMessageIs(
						ToastTitle.SUCCESS,
						ToastSubTitle.ARTICLE_CREATED_SUCCESSFULLY,
					);

				await sportsBlogAdmin.pages.sportsBlogPage
					.assertThat()
					.articleIsDisplayedInArticlesTable(articleTestData.title);
			},
		);
	},
);
