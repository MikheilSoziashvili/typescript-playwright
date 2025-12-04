import { test } from "@fixtures/fixtures";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import { testData } from "test-data/test-data-manager";

test.describe(
	"Admin - Writer",
	testDetails().withTags(JiraComponent.SEO).apply(),
	() => {
		const adminWriterTestDataDomain = testData().fromDomain().adminWriter;

		adminWriterTestDataDomain.blogImageUploadScenarios.forEach(
			(blogImageUploadScenario) => {
				test(
					`[ENG-7574] [SEO] Check the file size limit of 1 MB for image upload in Writer panel - Upload: ${
						adminWriterTestDataDomain
							.BLOG_IMAGE_UPLOAD_BUTTON_LABEL[
							blogImageUploadScenario.uploadButton
						]
					} - ${
						adminWriterTestDataDomain.IMAGE_SIZE_LABEL[
							blogImageUploadScenario.imageSize
						]
					}`,
					testDetails().withAuthor(JiraUser.YUKSEL_CHAUSH).apply(),
					async ({ browserSessionManager, writerAdminNewPage }) => {
						await browserSessionManager.loginAs(
							TestUserRole.SUPERADMIN,
							{ reuseContext: true },
						);

						await writerAdminNewPage.navigate();
						await writerAdminNewPage.clickCreateNewBlogButton();

						await blogImageUploadScenario.uploadImageStep(
							writerAdminNewPage,
						);

						await blogImageUploadScenario.assertUploadImageStepResult(
							writerAdminNewPage,
						);
					},
				);
			},
		);
	},
);
