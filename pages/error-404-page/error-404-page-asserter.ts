import { BaseAsserter } from "@base/base-asserter";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { Error404PageContent } from "@constants/error-404-page-content";
import { Error404Page } from "./error-404-page";

export class Error404PageAsserter extends BaseAsserter<Error404Page> {
	public constructor(page: Error404Page) {
		super(page);
	}

	@step("Verify 404 page is displayed")
	public async verify404PageIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.page).toHaveURL(
			Error404PageContent.URL_PATTERN,
		);
		await this.checkElementsAreVisible([
			this.gamdomPage.map.error404Title,
			this.gamdomPage.map.error404Message,
			this.gamdomPage.map.error404ReturnHomeButton,
		]);
	}
}
