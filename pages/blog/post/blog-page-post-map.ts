import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class BlogPostPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get blogPostPageContent(): Locator {
		return this.page
			.getByTestId("page-content")
			.locator('[class*="BlogContainer-sc"]');
	}

	public get blogPostSectionContainer(): Locator {
		return this.blogPostPageContent.locator('[class*="BlogSection-sc"]');
	}

	public get blogPostTitle(): Locator {
		return this.blogPostSectionContainer.locator(
			"p[class*='ArticleTitle-sc']",
		);
	}

	public get blogPostSubTitle(): Locator {
		return this.blogPostSectionContainer.locator(
			"p[class*='ArticleSubtitle-sc']",
		);
	}
}
