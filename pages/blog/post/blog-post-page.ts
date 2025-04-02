import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { BlogPostPageMap } from "./blog-page-post-map";
import { BlogPostPageSteps } from "./blog-page-post-steps";
import { BlogPostPageAsserter } from "./blog-post-page-asserter";

export class BlogPostPage extends BasePage<BlogPostPageMap> {
	public constructor(page: Page) {
		super(page, new BlogPostPageMap(page));
	}

	public async navigateToBlogPost(
		blogPostEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [blogPostEndpoint] },
		});
	}

	public override assertThat(): BlogPostPageAsserter {
		return new BlogPostPageAsserter(this);
	}

	public steps(): BlogPostPageSteps {
		return new BlogPostPageSteps(this);
	}

	public async getBlogPostArticleTitle(): Promise<string> {
		return this.map.blogPostTitle.innerText();
	}

	public async getBlogPostArticleSubTitle(): Promise<string> {
		return this.map.blogPostSubTitle.innerText();
	}
}
