import { BasePage } from "@base/base-page";
import { step } from "decorators/step";
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

	@step("Navigate to help page category")
	public async navigateToHelpPageCategory(
		helpPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [helpPageEndpoint] },
		});
	}

	@step("Go to provably fair page per game")
	public async goToProvablyFairPagePerGame(gameName: string): Promise<void> {
		await this.map.provablyFairLinkByGameName(gameName).click();
	}
}
