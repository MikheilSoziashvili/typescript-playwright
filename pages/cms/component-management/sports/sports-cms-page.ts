import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CmsSportsPageMap } from "./sports-cms-page-map";
import { CmsSportsPageAsserter } from "./sports-cms-page-asserter";
import { CmsSportsPageSteps } from "./sports-cms-page-steps";
import { CMS_COMPONENT_MANAGEMENT_SPORTS_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class CmsSportsPage extends BasePage<CmsSportsPageMap> {
	public constructor(page: Page) {
		super(page, new CmsSportsPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [CMS_COMPONENT_MANAGEMENT_SPORTS_ENDPOINT] },
		});
	}

	public override assertThat(): CmsSportsPageAsserter {
		return new CmsSportsPageAsserter(this);
	}

	public steps(): CmsSportsPageSteps {
		return new CmsSportsPageSteps(this);
	}
}
