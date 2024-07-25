import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { GeoblockedPageMap } from "./geoblocked-page-map";
import { GeoblockedPageAsserter } from "./geoblocked-page-asserter";
import { GEOBLOCKED_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class GeoblockedPage extends BasePage<GeoblockedPageMap> {
	public constructor(page: Page) {
		super(page, new GeoblockedPageMap(page));
	}
	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { path: GEOBLOCKED_PAGE_ENDPOINT },
		});
	}

	public override assertThat(): GeoblockedPageAsserter {
		return new GeoblockedPageAsserter(this);
	}
}
