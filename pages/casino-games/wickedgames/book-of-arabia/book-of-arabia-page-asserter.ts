import { BaseAsserter } from "@base/base-asserter";
import { BookOfArabiaPage } from "./book-of-arabia-page";

export class BookOfArabiaPageAsserter extends BaseAsserter<BookOfArabiaPage> {
	public constructor(page: BookOfArabiaPage) {
		super(page);
	}
}
