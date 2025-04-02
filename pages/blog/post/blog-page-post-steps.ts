import { BasePageStep } from "@pages/base/base-page-step";
import { BlogPostPage } from "./blog-post-page";

export class BlogPostPageSteps extends BasePageStep<BlogPostPage> {
	public constructor(gamdomPage: BlogPostPage) {
		super(gamdomPage);
	}
}
