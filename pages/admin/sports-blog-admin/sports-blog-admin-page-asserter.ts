import { BaseAsserter } from "@pages/base/base-asserter";
import { SportsBlogAdminPage } from "./sports-blog-admin-page";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";

export class SportsBlogAdminAsserter extends BaseAsserter<SportsBlogAdminPage> {
	public constructor(page: SportsBlogAdminPage) {
		super(page);
	}

	@step("Article is displayed in the blog articles table")
	public async articleIsDisplayedInArticlesTable(
		articleTitle: string,
		timeout = Timeout.LONG,
	): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.tableRowByArticleTitle(articleTitle)],
			timeout,
		);
	}
}
