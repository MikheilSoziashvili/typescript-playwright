import { BaseAsserter } from "@base/base-asserter";
import { BlogPage } from "./blog-page";

export class BlogPageAsserter extends BaseAsserter<BlogPage> {
	public constructor(page: BlogPage) {
		super(page);
	}
}
