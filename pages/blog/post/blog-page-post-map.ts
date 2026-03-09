import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class BlogPostPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get blogPostPageContent(): Locator {
		return this.page.getByTestId("blog-article-article-details");
	}

	public get blogPostSectionContainer(): Locator {
		return this.page.getByTestId(
			"blog-article-article-details-content-container",
		);
	}

	public get blogPostTitle(): Locator {
		return this.page.getByTestId("blog-article-article-details-title");
	}

	public get blogPostSubTitle(): Locator {
		return this.blogPostSectionContainer.getByTestId(
			"blog-article-article-details-subtitle",
		);
	}

	public socialShareButtonByAlt(alt: string): Locator {
		return this.blogPostPageContent.getByTestId(
			`blog-article-article-details-${alt.toLowerCase()}`,
		);
	}
}
