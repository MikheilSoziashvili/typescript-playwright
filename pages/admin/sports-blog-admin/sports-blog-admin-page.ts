import {
	SPORTS_BLOG_PAGE_ENDPOINT
} from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BasePage } from "@pages/base/base-page";
import { step } from "decorators/step";
import { Page } from "playwright";
import { SportsBlogAdminAsserter } from "./sports-blog-admin-page-asserter";
import { SportsBlogAdminMap } from "./sports-blog-admin-page-map";
import { SportsBlogAdminSteps } from "./sports-blog-admin-page-steps";

export class SportsBlogAdminPage extends BasePage<SportsBlogAdminMap> {
	public constructor(page: Page) {
		super(page, new SportsBlogAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [SPORTS_BLOG_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): SportsBlogAdminAsserter {
		return new SportsBlogAdminAsserter(this);
	}

	public steps(): SportsBlogAdminSteps {
		return new SportsBlogAdminSteps(this);
	}

	@step("Click create article button")
	public async clickCreateNewArticleButton(): Promise<void> {
		await this.map.createNewArticleButton.click();
	}
}
