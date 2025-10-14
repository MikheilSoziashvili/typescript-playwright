import { BaseAsserter } from "@pages/base/base-asserter";
import { KenoGamePage } from "./keno-game-page";
import { step } from "decorators/step";
import { BooleanValueString } from "@enums/playwright/booleanValues";

export class KenoGamePageAsserter extends BaseAsserter<KenoGamePage> {
	public constructor(page: KenoGamePage) {
		super(page);
	}

	@step("Start playing button is displayed")
	public async startPlayingButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.startPlayingButton,
		]);
	}

	@step("Start playing button is enabled")
	public async startPlayingButtonIsEnabled(): Promise<void> {
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.startPlayingButton,
		]);
	}

	@step("Verify risk slider active")
	public async verifyRiskSliderActive(timeout?: number): Promise<void> {
		await this.verifySliderState(
			this.gamdomPage.map.riskRowsSliderInput,
			BooleanValueString.FALSE,
			timeout,
		);
	}

	@step("Start playing button is disabled")
	public async startPlayingButtonIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.startPlayingButton,
		]);
	}

	@step("Win image is displayed")
	public async winImageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.winImage]);
	}

	@step("Check if win occurred")
	public async isWinDetected(): Promise<boolean> {
		const element = this.gamdomPage.map.winImage;
		if (await element.isVisible()) {
			const text = await element.textContent();
			return !!text?.trim();
		}
		return false;
	}
}
