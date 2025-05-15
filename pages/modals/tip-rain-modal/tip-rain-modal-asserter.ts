import { BaseAsserter } from "@base/base-asserter";
import { TipRainModal } from "./tip-rain-modal";
import { step } from "decorators/step";

export class TipRainModalAsserter extends BaseAsserter<TipRainModal> {
	public constructor(page: TipRainModal) {
		super(page);
	}

	@step("Tip rain modal is displayed")
	public async tipRainModalIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.tipRainModal]);
	}

	@step("Tip rain modal is not displayed")
	public async tipRainModalIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.tipRainModal,
		]);
	}
}
