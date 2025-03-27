import { BasePage } from "@base/base-page";
import { PLINKO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { PlinkoGamePageAsserter } from "./plinko-game-page-asserter";
import { PlinkoGamePageMap } from "./plinko-game-page-map";
import { PlinkoGamePageSteps } from "./plinko-game-page-steps";
import { step } from "decorators/step";
import { Attributes } from "@enums/playwright/htmlAttributes";

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

	@step()
	public async openLoginModal(): Promise<void> {
		await this.map.signInButton.click();
	}

	@step()
	public async clickAutobet(): Promise<void> {
		await this.map.autoBetButton.click();
	}

	@step()
	public async getRemainingBetsCount(): Promise<string> {
		const count = await this.map.remainingBetsBalanceLabel.innerText();
		return count.toString();
	}

	@step()
	public async getNumberOfBetsInput(): Promise<string> {
		const numberOfBetsInput = await this.map.numberOfBetsInput.getAttribute(
			Attributes.VALUE,
		);
		return numberOfBetsInput || "";
	}
}
