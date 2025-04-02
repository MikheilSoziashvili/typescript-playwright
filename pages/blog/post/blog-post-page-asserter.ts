import { BaseAsserter } from "@base/base-asserter";
import { BlogPostPage } from "./blog-post-page";

export class BlogPostPageAsserter extends BaseAsserter<BlogPostPage> {
	public constructor(page: BlogPostPage) {
		super(page);
	}
}
