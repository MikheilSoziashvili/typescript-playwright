import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { BlogCategoryPage } from "./blog-category-page";
import { BlogPostCategories } from "@enums/post-categories";

export class BlogCategoryPageSteps extends BasePageStep<BlogCategoryPage> {
	public constructor(gamdomPage: BlogCategoryPage) {
		super(gamdomPage);
	}

	@step("Navigate to blog category successfully")
	public async navigateToBlogCategorySuccessfully(
		blogCategoryEndpoint: string,
		blogCategoryName: string,
	): Promise<void> {
		await this.gamdomPage.navigateToBlogCategory(blogCategoryEndpoint);
		if (blogCategoryName === BlogPostCategories.GAMDOM_NEWS) {
			blogCategoryName = blogCategoryName.replace(/_/g, " ");
		}
		await this.gamdomPage
			.assertThat()
			.isBlogCategoryNameDisplayedInTitle(blogCategoryName);
	}
}
