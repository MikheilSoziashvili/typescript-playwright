import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { LimboGamePageMap } from "./limbo-game-page-map";
import { LimboGamePageAsserter } from "./limbo-game-page-asserter";
import { LimboGamePageSteps } from "./limbo-game-page-steps";
import { LIMBO_GAME_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { LimboBetTestData } from "@dtos/test-data";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { Toast } from "@pages/components/toast/toast";

export class LimboGamePage extends BasePage<LimboGamePageMap> {
	public toast: Toast;

	public constructor(page: Page) {
		super(page, new LimboGamePageMap(page));
		this.toast = new Toast(page);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [LIMBO_GAME_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): LimboGamePageAsserter {
		return new LimboGamePageAsserter(this);
	}

	public steps(): LimboGamePageSteps {
		return new LimboGamePageSteps(this);
	}

	@step("Fill bet data")
	public async fillBetData(limboBetData: LimboBetTestData): Promise<void> {
		await this.map.betAmountInput.fill(`${limboBetData.betAmount}`);
		await this.map.multiplierInput.fill(`${limboBetData.multiplier}`);
	}

	@step("Click roll")
	public async clickRoll(): Promise<void> {
		await this.map.rollButton.click();
	}

	@step("Get last result multiplier from history")
	public async getLastResultMultiplier(): Promise<number> {
		const chipText = await this.map.lastHistoryChipValue.textContent();
		const multiplierText = (chipText ?? "0").replace("x", "");
		return parseFloat(multiplierText);
	}
}
