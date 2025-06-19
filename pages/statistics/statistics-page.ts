import { BasePage } from "@base/base-page";
import { STATISTICS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { StatisticsPageAsserter } from "./statistics-page-asserter";
import { StatisticsPageMap } from "./statistics-page-map";
import { StatisticsPageSteps } from "./statistics-page-steps";

export class StatisticsPage extends BasePage<StatisticsPageMap> {
	public constructor(page: Page) {
		super(page, new StatisticsPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [STATISTICS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): StatisticsPageAsserter {
		return new StatisticsPageAsserter(this);
	}

	public steps(): StatisticsPageSteps {
		return new StatisticsPageSteps(this);
	}
}
