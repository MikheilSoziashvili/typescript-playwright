import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { BookOfArabiaPageAsserter } from "./book-of-arabia-page-asserter";
import { BookOfArabiaPageMap } from "./book-of-arabia-page-map";
import { BookOfArabiaPageSteps } from "./book-of-arabia-page-step";

export class BookOfArabiaPage extends BasePage<BookOfArabiaPageMap> {
	public constructor(page: Page) {
		super(page, new BookOfArabiaPageMap(page));
	}

	public override assertThat(): BookOfArabiaPageAsserter {
		return new BookOfArabiaPageAsserter(this);
	}

	public steps(): BookOfArabiaPageSteps {
		return new BookOfArabiaPageSteps(this);
	}

	@step("Click continue button")
	public async clickContinueButton(): Promise<void> {
		await this.map.continueButton.click();
	}
}
