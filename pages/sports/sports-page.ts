import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { SportsAsserter } from "./sports-page-asserter";
import { SportsMap } from "./sports-page-map";
import { SportsSteps } from "./sports-page-steps";
import { SPORTS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Toast } from "@pages/components/toast/toast";

export class SportsPage extends BasePage<SportsMap> {
	public readonly toast: Toast;
	public constructor(page: Page) {
		super(page, new SportsMap(page));
		this.toast = new Toast(page);
	}

	public override assertThat(): SportsAsserter {
		return new SportsAsserter(this);
	}

	public steps(): SportsSteps {
		return new SportsSteps(this);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [SPORTS_PAGE_ENDPOINT] },
		});
	}
}
