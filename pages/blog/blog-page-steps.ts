import { BasePageStep } from "@pages/base/base-page-step";
import { BlogPage } from "./blog-page";

export class BlogPageSteps extends BasePageStep<BlogPage> {
	public constructor(gamdomPage: BlogPage) {
		super(gamdomPage);
	}
}
