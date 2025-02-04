import { BaseAsserter } from "@base/base-asserter";
import { TipRainModal } from "./tip-rain-modal";
import { step } from "decorators/step";

export class TipRainModalAsserter extends BaseAsserter<TipRainModal> {
	public constructor(page: TipRainModal) {
		super(page);
	}

	@step()
	public async isDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.tipRainModal]);
	}

	@step()
	public async isNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.tipRainModal,
		]);
	}
}
