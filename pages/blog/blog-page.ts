import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { BlogPageAsserter } from "./blog-page-asserter";
import { BlogPageMap } from "./blog-page-map";
import { BlogPageSteps } from "./blog-page-steps";
import { BasePageNavigationParametersType } from "@core/types/types";
import { BLOG } from "@constants/page-endpoints";
import { step } from "decorators/step";

export class BlogPage extends BasePage<BlogPageMap> {
	public constructor(page: Page) {
		super(page, new BlogPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [BLOG] },
		});
	}

	public override assertThat(): BlogPageAsserter {
		return new BlogPageAsserter(this);
	}

	public steps(): BlogPageSteps {
		return new BlogPageSteps(this);
	}

	@step("Click on the View Article button")
	public async clickViewArticleButton(): Promise<void> {
		await this.map.primaryArticleReadMoreButton.click();
	}
}
