import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { Error404PageMap } from "./error-404-page-map";
import { Error404PageAsserter } from "./error-404-page-asserter";
import { ERROR_404_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class Error404Page extends BasePage<Error404PageMap> {
	public constructor(page: Page) {
		super(page, new Error404PageMap(page));
	}

	@step("Navigate to 404 page")
	public async navigateTo404Page(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [ERROR_404_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): Error404PageAsserter {
		return new Error404PageAsserter(this);
	}

	@step("Click return home button")
	public async clickReturnHomeButton(): Promise<void> {
		await this.map.error404ReturnHomeButton.click();
	}
}
