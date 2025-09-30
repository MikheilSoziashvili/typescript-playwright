import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { DATASETS_DIR } from "@constants/file-paths";
import {
	parse_csv,
	createDummyPngImage,
	deleteFilesWithFilePaths,
	generateRandomString,
} from "@core/utils/utils";

import { BlogPostTestData } from "@dtos/test-data";
import { BlogPostCategories } from "@enums/post-categories";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { CsvFilesName } from "../enums/csv-file-name";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { isScheduledRun } from "configuration";

const postRecords = parse_csv(
	DATASETS_DIR,
	CsvFilesName.CREATE_POST_ARTICLE,
) as {
	category: BlogPostCategories;
	category_endpoint: string;
}[];

test.describe("Create article and posts tests", () => {
	let dummyCoverImageFilePath: string;
	let dummyThumbnailImageFilePath: string;

	test.use(storageStateUserAPI(SUPER_ADMIN_CREDENTIALS.username));

	test.beforeEach(async () => {
		dummyCoverImageFilePath = await createDummyPngImage();
		dummyThumbnailImageFilePath = await createDummyPngImage();
	});
	test.afterEach(async () => {
		await deleteFilesWithFilePaths([
			dummyCoverImageFilePath,
			dummyThumbnailImageFilePath,
		]);
	});

	test.fixme(isScheduledRun);
	postRecords.forEach((postRecords) => {
		test(
			`[ENG-1057] Create new [${postRecords.category}] article and post it in [${postRecords.category_endpoint}] category`,
			testDetails()
				.withJiraBugTickets("2627")
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({ writerAdminPage, toast, blogCategoryPage }) => {
				test.fixme(true);
				const postArticleTestData = new BlogPostTestData({
					paragraph: generateRandomString({
						prefix: "automation_blog_paragraph_",
						length: 5,
					}),
					title: generateRandomString({
						prefix: "automation_blog_title_",
					}),
					subTitle: generateRandomString({
						prefix: "automation_blog_sub_title_",
					}),
					author: generateRandomString({
						prefix: "automation_blog_author_",
					}),
					slug: generateRandomString({
						prefix: "automation-blog-slug-",
					}),
					categories: [postRecords.category],
					coverImage: dummyCoverImageFilePath,
					thumbnailImage: dummyThumbnailImageFilePath,
				});

				await writerAdminPage.navigate();
				await writerAdminPage.assertThat().isMainBlocksDisplayed();
				await writerAdminPage
					.steps()
					.createArticlePost(postArticleTestData);
				await toast.assertThat().titleIs(ToastTitle.SUCCESS);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.SUCCESSFUL_UPLOAD);
				await blogCategoryPage
					.steps()
					.navigateToBlogCategorySuccessfully(
						postRecords.category_endpoint,
						postRecords.category,
					);
				await blogCategoryPage
					.assertThat()
					.isPostDisplayed(
						postArticleTestData.title,
						postArticleTestData.subTitle,
					);
			},
		);
	});
});
