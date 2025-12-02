import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class SportsBlogAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get createNewArticleButton(): Locator {
		return this.page.locator("button[type='button']", {
			hasText: "Create",
		});
	}

	public get articlesTable(): Locator {
		return this.page.locator(`table`);
	}

	public get articlesTableBody(): Locator {
		return this.articlesTable.locator(`tbody`);
	}

	public tableRowByArticleTitle(articleTitle: string): Locator {
		return this.articlesTableBody.locator("tr").filter({
			has: this.page.locator("td:nth-child(2)", {
				hasText: articleTitle,
			}),
		});
	}
}
