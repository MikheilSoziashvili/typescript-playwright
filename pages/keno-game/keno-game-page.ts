import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { KenoGamePageMap } from "./keno-game-page-map";
import { KenoGamePageAsserter } from "./keno-game-page-asserter";
import { KenoGamePageSteps } from "./keno-game-page-steps";
import { KENO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";

export class KenoGamePage extends BasePage<KenoGamePageMap> {
	public constructor(page: Page) {
		super(page, new KenoGamePageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [KENO_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): KenoGamePageAsserter {
		return new KenoGamePageAsserter(this);
	}

	public steps(): KenoGamePageSteps {
		return new KenoGamePageSteps(this);
	}

	public async insertBet(betAmount: string | number): Promise<void> {
		await this.map.betAmountInput.fill(betAmount.toString());
	}

	public async pressMinButton(): Promise<void> {
		await this.map.minButton.click();
	}

	public async pressHalfButton(): Promise<void> {
		await this.map.halfButton.click();
	}

	public async getBetAmountValue(): Promise<string> {
		return this.map.betAmountInput.inputValue();
	}
}
