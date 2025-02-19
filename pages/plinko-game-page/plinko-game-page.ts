import { BasePage } from "@base/base-page";
import { PLINKO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { PlinkoGamePageAsserter } from "./plinko-game-page-asserter";
import { PlinkoGamePageMap } from "./plinko-game-page-map";
import { PlinkoGamePageSteps } from "./plinko-game-page-steps";

export class PlinkoGamePage extends BasePage<PlinkoGamePageMap> {
	public constructor(page: Page) {
		super(page, new PlinkoGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PLINKO_GAME_PAGE_ENDPOINT] },
		});
	}

	public steps(): PlinkoGamePageSteps {
		return new PlinkoGamePageSteps(this);
	}

	public override assertThat(): PlinkoGamePageAsserter {
		return new PlinkoGamePageAsserter(this);
	}

	public async openLoginModal(): Promise<void> {
		await this.map.signInButton.click();
	}
}
