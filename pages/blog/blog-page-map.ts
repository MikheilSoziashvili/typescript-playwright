import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class BlogPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get blogPageContent(): Locator {
		return this.page.getByTestId("blog");
	}

	public get primaryArticleReadMoreButton(): Locator {
		return this.blogPageContent.getByTestId(
			"blog-news-top-article-article-primary-card-read-more-btn",
		);
	}
}
