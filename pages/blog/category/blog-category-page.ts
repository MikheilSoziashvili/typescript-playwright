import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { BlogCategoryPageAsserter } from "./blog-category-page-asserter";
import { BlogCategoryPageMap } from "./blog-category-page-map";
import { BlogCategoryPageSteps } from "./blog-category-page-steps";

export class BlogCategoryPage extends BasePage<BlogCategoryPageMap> {
	public constructor(page: Page) {
		super(page, new BlogCategoryPageMap(page));
	}

	public override assertThat(): BlogCategoryPageAsserter {
		return new BlogCategoryPageAsserter(this);
	}

	public steps(): BlogCategoryPageSteps {
		return new BlogCategoryPageSteps(this);
	}

	public async navigateToBlogCategory(
		categoryEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [categoryEndpoint] },
		});
	}
}
