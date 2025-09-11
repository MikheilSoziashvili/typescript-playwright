import { BaseAsserter } from "@pages/base/base-asserter";
import { KenoGamePage } from "./keno-game-page";
import { step } from "decorators/step";
import { BooleanValueString } from "@enums/playwright/booleanValues";

export class KenoGamePageAsserter extends BaseAsserter<KenoGamePage> {
	public constructor(page: KenoGamePage) {
		super(page);
	}

	@step("Start playing button is displayed")
	async startPlayingButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.startPlayingButton,
		]);
	}

	@step("Start playing button is enabled")
	async startPlayingButtonIsEnabled(): Promise<void> {
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.startPlayingButton,
		]);
	}

	@step("Verify risk slider active")
	async verifyRiskSliderActive(timeout?: number): Promise<void> {
		await this.verifySliderState(
			this.gamdomPage.map.riskRowsSliderInput,
			BooleanValueString.FALSE,
			timeout,
		);
	}
}
