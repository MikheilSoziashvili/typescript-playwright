import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class BlogCategoryPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get blogCategoryView(): Locator {
		return this.page.getByTestId("blogCategoryHeaderWrapper");
	}

	public get blogCategoryViewTitle(): Locator {
		return this.blogCategoryView.getByTestId("blogCategorytitle");
	}

	public get postContainer(): Locator {
		return this.page.getByTestId("blogPostContainer");
	}

	public get postTitle(): Locator {
		return this.postContainer.getByTestId("blogPostTitle");
	}

	public get postSubTitle(): Locator {
		return this.postContainer.getByTestId("blogPostSubtitle");
	}
}
