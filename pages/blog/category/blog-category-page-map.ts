import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class BlogCategoryPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get blogCategoryView(): Locator {
		return this.page.locator("[class*=CategoryHeaderWrapper]");
	}

	public get blogCategoryViewTitle(): Locator {
		return this.blogCategoryView.locator("h1[class*='Title']");
	}

	public get postContainer(): Locator {
		return this.page.locator("[class*='Container-sc']");
	}

	public get postTitle(): Locator {
		return this.postContainer.locator("h2[class*='root'][class*='h5']");
	}

	public get postSubTitle(): Locator {
		return this.postContainer.locator("[class*='subtitle']");
	}
}
