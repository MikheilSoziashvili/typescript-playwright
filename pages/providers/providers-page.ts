import { BasePageNavigationParametersType } from "@core/types/types";
import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { ProvidersPageMap } from "./providers-page-map";
import { ProvidersPageAsserter } from "./providers-page-asserter";
import { ProvidersPageSteps } from "./providers-page-step";
import { POVIDERS_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class ProvidersPage extends BasePage<ProvidersPageMap> {
	public constructor(page: Page) {
		super(page, new ProvidersPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [POVIDERS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): ProvidersPageAsserter {
		return new ProvidersPageAsserter(this);
	}

	public steps(): ProvidersPageSteps {
		return new ProvidersPageSteps(this);
	}
}
