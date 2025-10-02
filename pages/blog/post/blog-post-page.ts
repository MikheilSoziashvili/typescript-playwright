import { BasePage } from "@base/base-page";
import { step } from "decorators/step";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { BlogPostPageMap } from "./blog-page-post-map";
import { BlogPostPageSteps } from "./blog-page-post-steps";
import { BlogPostPageAsserter } from "./blog-post-page-asserter";
import { SocialMedia } from "@enums/social-medias";

export class BlogPostPage extends BasePage<BlogPostPageMap> {
	public constructor(page: Page) {
		super(page, new BlogPostPageMap(page));
	}

	@step("Navigate to blog post")
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

	@step("Get blog post article title")
	public async getBlogPostArticleTitle(): Promise<string> {
		return this.map.blogPostTitle.innerText();
	}

	@step("Get blog post article subtitle")
	public async getBlogPostArticleSubTitle(): Promise<string> {
		return this.map.blogPostSubTitle.innerText();
	}

	@step("Click share button for a certain social media")
	public async clickShareButton(media: SocialMedia): Promise<void> {
		await this.map.socialShareButtonByAlt(media).click();
	}
}
