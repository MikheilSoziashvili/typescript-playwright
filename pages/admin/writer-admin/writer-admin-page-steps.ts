import { BlogPostTestData } from "@dtos/test-data";
import { BlogPostCategories } from "@enums/post-categories";
import { Timeout } from "@enums/timeout";
import { BasePageStep } from "@pages/base/base-page-step";
import { WriterAdminPage } from "./writer-admin-page";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";

export class WriterAdminPageSteps extends BasePageStep<WriterAdminPage> {
	public constructor(gamdomPage: WriterAdminPage) {
		super(gamdomPage);
	}

	public async selectPostCategories(
		categories: BlogPostCategories[],
	): Promise<void> {
		await this.gamdomPage.map.postCategoriesDropdown.click();
		for (const category of categories) {
			await this.gamdomPage.selectPostCategory(category);
			await this.gamdomPage.map.waitForAttributeToHaveValue(
				this.gamdomPage.map.postCategoriesOption(category),
				Attributes.ARIA_SELECTED,
				BooleanValueString.TRUE,
				Timeout.SHORT,
			);
		}

		// Without force click closing the dropdown is not possible
		// eslint-disable-next-line playwright/no-force-option
		await this.gamdomPage.map.blogTitleInput.click({ force: true });
	}

	public async createArticlePost(postData: BlogPostTestData): Promise<void> {
		await this.gamdomPage.fillPostParagraph(postData.paragraph);
		await this.gamdomPage.fillPostTitle(postData.title);
		await this.gamdomPage.fillPostSubTitle(postData.subTitle);
		await this.gamdomPage.fillPostAuthor(postData.author);
		await this.gamdomPage.fillCustomUrl(postData.slug);
		await this.gamdomPage.fillPostParagraph(postData.paragraph);
		await this.gamdomPage.uploadPostCoverImage(postData.coverImage);
		await this.gamdomPage.uploadPostThumbnailImage(postData.thumbnailImage);
		await this.selectPostCategories(postData.categories);
		await this.gamdomPage.savePost();
		await this.gamdomPage.confirmPost();
		await this.gamdomPage.savePost();
		await this.gamdomPage.confirmPost();
	}
}
