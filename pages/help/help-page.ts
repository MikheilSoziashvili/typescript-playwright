import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { HelpPageAsserter } from "./help-page-asserter";
import { HelpPageMap } from "./help-page-map";
import { HelpPageSteps } from "./help-page-steps";

export class HelpPage extends BasePage<HelpPageMap> {
	public constructor(page: Page) {
		super(page, new HelpPageMap(page));
	}

	public override assertThat(): HelpPageAsserter {
		return new HelpPageAsserter(this);
	}

	public steps(): HelpPageSteps {
		return new HelpPageSteps(this);
	}

	public async navigateToHelpPageCategory(
		helpPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [helpPageEndpoint] },
		});
	}
}
