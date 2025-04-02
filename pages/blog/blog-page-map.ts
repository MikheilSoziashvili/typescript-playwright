import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class BlogPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get blogPageContent(): Locator {
		return this.page.getByTestId("page-content");
	}

	public get blogHeaderContainer(): Locator {
		return this.blogPageContent.locator(
			"[class*=NewsHead-styled__Container-]",
		);
	}

	public get viewArticleHeaderButton(): Locator {
		return this.blogHeaderContainer.locator("button", {
			hasText: "View Article",
		});
	}
}
